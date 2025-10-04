import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicYear } from './entities/academic-year.entity';
import {
  CreateAcademicYearDto,
  ListAcademicYearDto,
  UpdateAcademicYearDto,
} from './dto';
import { PaginatedResultDto } from '../common';

@Injectable()
export class AcademicYearsService {
  constructor(
    @InjectRepository(AcademicYear)
    private readonly academicYearRepository: Repository<AcademicYear>,
  ) {}

  async create(createAcademicYearDto: CreateAcademicYearDto): Promise<AcademicYear> {
    const academicYear = this.academicYearRepository.create(createAcademicYearDto);
    return await this.academicYearRepository.save(academicYear);
  }

  async findAll(
    query: ListAcademicYearDto,
  ): Promise<PaginatedResultDto<AcademicYear>> {
    const { page = 1, limit = 10, year, search } = query;
    const skip = (page - 1) * limit;

    const qb = this.academicYearRepository.createQueryBuilder('academicYear');
    qb.skip(skip).take(limit).orderBy('academicYear.year', 'DESC');

    if (year) {
      qb.andWhere('academicYear.year = :year', { year });
    }

    if (search) {
      qb.andWhere('academicYear.name ILIKE :search', { search: `%${search}%` });
    }

    const [data, total] = await qb.getManyAndCount();
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  }

  async findOne(id: string): Promise<AcademicYear> {
    const academicYear = await this.academicYearRepository.findOne({ where: { id } });
    if (!academicYear) {
      throw new NotFoundException(`Academic year with ID ${id} not found`);
    }
    return academicYear;
  }

  async findByYear(year: number): Promise<AcademicYear | null> {
    return await this.academicYearRepository.findOne({ where: { year } });
  }

  async update(
    id: string,
    updateAcademicYearDto: UpdateAcademicYearDto,
  ): Promise<AcademicYear> {
    const academicYear = await this.findOne(id);
    Object.assign(academicYear, updateAcademicYearDto);
    return await this.academicYearRepository.save(academicYear);
  }

  async remove(id: string): Promise<void> {
    const academicYear = await this.findOne(id);
    await this.academicYearRepository.remove(academicYear);
  }
}
