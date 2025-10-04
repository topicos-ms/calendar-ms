import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TermsService } from './terms.service';
import { TermsController } from './terms.controller';
import { Term } from './entities/term.entity';
import { AcademicYearsModule } from '../academic-years/academic-years.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Term]),
    AcademicYearsModule,
  ],
  controllers: [TermsController],
  providers: [TermsService],
})
export class TermsModule {}
