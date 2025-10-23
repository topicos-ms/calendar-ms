import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicYear } from './academic-years/entities/academic-year.entity';
import { Term } from './terms/entities/term.entity';

@Controller()
export class SeedingController {
  constructor(
    @InjectRepository(AcademicYear)
    private readonly academicYearRepository: Repository<AcademicYear>,
    @InjectRepository(Term)
    private readonly termRepository: Repository<Term>,
  ) {}

  @MessagePattern('calendar.clearTestData')
  async clearTestData() {
    try {
      // Use TRUNCATE CASCADE to handle foreign key constraints
      await this.termRepository.query('TRUNCATE TABLE "term" CASCADE');
      await this.academicYearRepository.query('TRUNCATE TABLE "academic_year" CASCADE');

      return {
        success: true,
        message: 'All calendar test data cleared successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error clearing calendar test data: ' + error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
