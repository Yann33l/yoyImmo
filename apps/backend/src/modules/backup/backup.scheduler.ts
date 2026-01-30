import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BackupService } from './backup.service';

@Injectable()
export class BackupScheduler {
  private readonly logger = new Logger(BackupScheduler.name);

  constructor(private readonly backupService: BackupService) {}

  /**
   * Executes automatic daily backup at 3:00 AM
   * Cron expression: '0 3 * * *' = Every day at 3:00 AM
   */
  @Cron('0 3 * * *')
  async handleDailyBackup() {
    const timestamp = new Date().toISOString();
    this.logger.log(`Starting automatic daily backup at ${timestamp}...`);

    try {
      const filepath = await this.backupService.createBackup();
      this.logger.log(`Daily backup completed: ${filepath}`);

      // Rotate old backups
      await this.backupService.rotateOldBackups();
      this.logger.log('Old backups rotation completed');
    } catch (error) {
      this.logger.error(
        `Daily backup failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      // Do not throw - allow app to continue running
      // The next scheduled backup will run as planned
    }
  }
}
