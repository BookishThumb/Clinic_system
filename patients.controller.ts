import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientStatusDto } from './dto/update-patient-status.dto';
import { Patient } from './patient.entity';

@Controller('patients')
@UseGuards(AuthGuard())
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  create(@Body() createPatientDto: CreatePatientDto): Promise<Patient> {
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  findAll(): Promise<Patient[]> {
    return this.patientsService.findAll();
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() updatePatientStatusDto: UpdatePatientStatusDto): Promise<Patient> {
    return this.patientsService.updateStatus(+id, updatePatientStatusDto);
  }
}