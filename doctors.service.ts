import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';

@Injectable()
export class DoctorsService implements OnModuleInit {
    constructor(
        @InjectRepository(Doctor)
        private doctorsRepository: Repository<Doctor>,
    ) {}

    async onModuleInit() {
        const count = await this.doctorsRepository.count();
        if (count === 0) {
            await this.doctorsRepository.save([
                { name: 'Dr. Smith', specialization: 'General Practice' },
                { name: 'Dr. Johnson', specialization: 'Pediatrics' },
                { name: 'Dr. Lee', specialization: 'Cardiology' },
            ]);
        }
    }

    findAll(): Promise<Doctor[]> {
        return this.doctorsRepository.find();
    }
}