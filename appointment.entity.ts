import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Doctor } from '../doctors/doctor.entity';
export enum AppointmentStatus { PENDING = 'Pending', CONFIRMED = 'Confirmed', CANCELED = 'Canceled' }
@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  patientId: string;
  @Column()
  patientName: string;
  @Column()
  reason: string;
  @Column()
  time: Date;
  @Column({ type: 'enum', enum: AppointmentStatus, default: AppointmentStatus.PENDING })
  status: AppointmentStatus;
  @Column()
  doctorId: number;
  @ManyToOne(() => Doctor, doctor => doctor.appointments)
  doctor: Doctor;
}