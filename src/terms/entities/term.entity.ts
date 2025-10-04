import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AcademicYear } from '../../academic-years/entities/academic-year.entity';

@Entity('term')
export class Term {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  academic_year_id: string;

  @Column('varchar', { length: 50 })
  name: string;

  @Column('date')
  start_date: Date;

  @Column('date')
  end_date: Date;

  @Column('varchar', { length: 20 })
  status: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => AcademicYear, (academicYear) => academicYear.terms, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'academic_year_id' })
  academic_year: AcademicYear;
}
