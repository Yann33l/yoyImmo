import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { BackupModule } from './modules/backup/backup.module';
import { winstonConfig } from './common/logger/winston.config';

@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
    PrismaModule,
    AuthModule,
    HealthModule,
    BackupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
