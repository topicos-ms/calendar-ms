import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AcademicYearsModule } from './academic-years/academic-years.module';
import { TermsModule } from './terms/terms.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => typeOrmConfig(configService),
    }),
    AcademicYearsModule,
    TermsModule,
  ],
})
export class AppModule {}
