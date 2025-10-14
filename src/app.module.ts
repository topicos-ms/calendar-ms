import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AcademicYearsModule } from './academic-years/academic-years.module';
import { TermsModule } from './terms/terms.module';
import { envs } from './config/envs';
import { EventPublisherInterceptor, EVENT_EMITTER } from './common/events/event-publisher.interceptor';
import { HealthController } from './common/health.controller';

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
    ClientsModule.register([
      {
        name: EVENT_EMITTER,
        transport: Transport.NATS,
        options: {
          servers: envs.natsServers,
        },
      },
    ]),
    AcademicYearsModule,
    TermsModule,
  ],
  controllers: [HealthController],
  providers: [EventPublisherInterceptor],
  exports: [EventPublisherInterceptor],
})
export class AppModule {}
