import { IsEnum, IsOptional, IsNumber } from 'class-validator';
import { PatientStatus } from '../patient.entity';
export class UpdatePatientStatusDto {
  @IsEnum(PatientStatus)
  status: PatientStatus;
  @IsOptional()
  @IsNumber()
  attendingDoctorId?: number;
}