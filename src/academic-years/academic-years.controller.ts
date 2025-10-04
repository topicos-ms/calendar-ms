import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AcademicYearsService } from './academic-years.service';
import {
  CreateAcademicYearDto,
  ListAcademicYearDto,
  UpdateAcademicYearDto,
} from './dto';

@Controller()
export class AcademicYearsController {
  constructor(private readonly academicYearsService: AcademicYearsService) {}

  @MessagePattern('calendar.academicYears.create')
  create(@Payload() createAcademicYearDto: CreateAcademicYearDto) {
    return this.academicYearsService.create(createAcademicYearDto);
  }

  @MessagePattern('calendar.academicYears.list')
  findAll(@Payload() listAcademicYearDto: ListAcademicYearDto) {
    return this.academicYearsService.findAll(listAcademicYearDto);
  }

  @MessagePattern('calendar.academicYears.findOne')
  findOne(@Payload() id: string) {
    return this.academicYearsService.findOne(id);
  }

  @MessagePattern('calendar.academicYears.update')
  update(
    @Payload()
    payload: {
      id: string;
      updateAcademicYearDto: UpdateAcademicYearDto;
    },
  ) {
    return this.academicYearsService.update(payload.id, payload.updateAcademicYearDto);
  }

  @MessagePattern('calendar.academicYears.remove')
  remove(@Payload() id: string) {
    return this.academicYearsService.remove(id);
  }
}
