import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Term } from './entities/term.entity';
import { CreateTermDto, ListTermDto, UpdateTermDto } from './dto';
import { AcademicYearsService } from '../academic-years/academic-years.service';
import { PaginatedResultDto } from '../common';

type AcademicYearLookup = Pick<CreateTermDto, 'academic_year_id' | 'year'>;

@Injectable()
export class TermsService {
  constructor(
    @InjectRepository(Term)
    private readonly termRepository: Repository<Term>,
    private readonly academicYearsService: AcademicYearsService,
  ) {}

  private async resolveAcademicYearId(
    input: AcademicYearLookup,
    fallbackId?: string,
  ): Promise<string> {
    if (input.academic_year_id) {
      return input.academic_year_id;
    }

    if (input.year) {
      const academicYear = await this.academicYearsService.findByYear(input.year);
      if (!academicYear) {
        throw new NotFoundException(
          `Academic year with year ${input.year} not found`,
        );
      }
      return academicYear.id;
    }

    if (fallbackId) {
      return fallbackId;
    }

    throw new NotFoundException(
      'You must provide either academic_year_id or year to reference an academic year',
    );
  }

  async create(createTermDto: CreateTermDto): Promise<Term> {
    const academicYearId = await this.resolveAcademicYearId(createTermDto);

    const term = this.termRepository.create({
      ...createTermDto,
      academic_year_id: academicYearId,
    });

    return await this.termRepository.save(term);
  }

  async findAll(query: ListTermDto): Promise<PaginatedResultDto<Term>> {
    const { page = 1, limit = 10, academic_year_id, status } = query;
    const skip = (page - 1) * limit;

    const qb = this.termRepository.createQueryBuilder('term');
    qb.skip(skip).take(limit).orderBy('term.start_date', 'DESC');

    if (academic_year_id) {
      qb.andWhere('term.academic_year_id = :academic_year_id', { academic_year_id });
    }

    if (status) {
      qb.andWhere('term.status = :status', { status });
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

  async findOne(id: string): Promise<Term> {
    const term = await this.termRepository.findOne({ where: { id } });
    if (!term) {
      throw new NotFoundException(`Term with ID ${id} not found`);
    }
    return term;
  }

  async update(id: string, updateTermDto: UpdateTermDto): Promise<Term> {
    const term = await this.findOne(id);

    if (updateTermDto.academic_year_id || updateTermDto.year) {
      term.academic_year_id = await this.resolveAcademicYearId(
        updateTermDto,
        term.academic_year_id,
      );
    }

    Object.assign(term, {
      ...updateTermDto,
      academic_year_id: term.academic_year_id,
    });

    return await this.termRepository.save(term);
  }

  async remove(id: string): Promise<void> {
    const term = await this.findOne(id);
    await this.termRepository.remove(term);
  }
}
