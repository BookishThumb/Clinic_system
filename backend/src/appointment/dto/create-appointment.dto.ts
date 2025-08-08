import 'reflect-metadata';
import { IsString, IsNotEmpty, IsDateString, IsNumber } from 'class-validator';
export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  patientName: string;
  @IsString()
  reason: string;
  @IsDateString()
  time: Date;
  @IsNumber()
  doctorId: number;
}
