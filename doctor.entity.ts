import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Appointment } from '../appointments/appointment.entity';
@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  specialization: string;
  @OneToMany(() => Appointment, appointment => appointment.doctor)
  appointments: Appointment[];
}
