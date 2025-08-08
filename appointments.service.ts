import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment, AppointmentStatus } from './appointment.entity';

@Injectable()
export class AppointmentsService {
    constructor(
        @InjectRepository(Appointment)
        private appointmentsRepository: Repository<Appointment>,
    ) {}

    create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
        const appointment = this.appointmentsRepository.create({
            ...createAppointmentDto,
            status: AppointmentStatus.CONFIRMED,
            patientId: `P${Math.floor(Math.random() * 1000)}` // Placeholder
        });
        return this.appointmentsRepository.save(appointment);
    }

    findAll(): Promise<Appointment[]> {
        return this.appointmentsRepository.find({ order: { time: 'ASC' } });
    }

    async update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
        const appointment = await this.appointmentsRepository.preload({
            id: id,
            ...updateAppointmentDto,
        });
        if (!appointment) {
            throw new NotFoundException(`Appointment with ID "${id}" not found`);
        }
        return this.appointmentsRepository.save(appointment);
    }

    async remove(id: number): Promise<void> {
        const appointment = await this.appointmentsRepository.findOneBy({ id });
        if (!appointment) {
            throw new NotFoundException(`Appointment with ID "${id}" not found`);
        }
        appointment.status = AppointmentStatus.CANCELED;
        await this.appointmentsRepository.save(appointment);
    }
}