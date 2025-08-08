import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientStatusDto } from './dto/update-patient-status.dto';
import { Patient, PatientStatus } from './patient.entity';

@Injectable()
export class PatientsService {
    constructor(
        @InjectRepository(Patient)
        private patientsRepository: Repository<Patient>,
    ) {}

    async create(createPatientDto: CreatePatientDto): Promise<Patient> {
        const count = await this.patientsRepository.count();
        const queueNumber = `A${101 + count}`;
        const patient = this.patientsRepository.create({
            ...createPatientDto,
            queueNumber,
            status: PatientStatus.WAITING,
            arrival: new Date(),
        });
        return this.patientsRepository.save(patient);
    }

    findAll(): Promise<Patient[]> {
        return this.patientsRepository.find({ order: { arrival: 'ASC' } });
    }

    async updateStatus(id: number, updatePatientStatusDto: UpdatePatientStatusDto): Promise<Patient> {
        const patient = await this.patientsRepository.findOneBy({ id });
        if (!patient) {
            throw new NotFoundException(`Patient with ID "${id}" not found`);
        }
        patient.status = updatePatientStatusDto.status;
        patient.attendingDoctorId = updatePatientStatusDto.attendingDoctorId;
        await this.patientsRepository.save(patient);
        return patient;
    }
}