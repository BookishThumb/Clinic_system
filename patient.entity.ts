import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
export enum PatientStatus { WAITING = 'Waiting', WITH_DOCTOR = 'With Doctor', COMPLETED = 'Completed' }
export enum PatientPriority { NORMAL = 'Normal', URGENT = 'Urgent' }
@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  queueNumber: string;
  @Column()
  arrival: Date;
  @Column({ type: 'enum', enum: PatientStatus, default: PatientStatus.WAITING })
  status: PatientStatus;
  @Column({ type: 'enum', enum: PatientPriority, default: PatientPriority.NORMAL })
  priority: PatientPriority;
  @Column({ nullable: true })
  attendingDoctorId: number;
}