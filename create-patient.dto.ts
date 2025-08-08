import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { PatientPriority } from '../patient.entity';
export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsEnum(PatientPriority)
  priority: PatientPriority;
}