import { Injectable, Logger } from '@nestjs/common';
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  private readonly dataPath = join(process.cwd(), '../../yoyimmo-data');
  private readonly backupPath = join(this.dataPath, 'backups');
  private readonly dbPath = join(this.dataPath, 'database/yoyimmo.db');

  async createBackup(): Promise<string> {
    try {
      // Ensure backup directory exists
      if (!existsSync(this.backupPath)) {
        mkdirSync(this.backupPath, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = join(this.backupPath, `backup-${timestamp}.db`);

      // Copy database file
      if (existsSync(this.dbPath)) {
        copyFileSync(this.dbPath, backupFile);
        this.logger.log(`Backup created: ${backupFile}`);
        return backupFile;
      } else {
        throw new Error('Database file not found');
      }
    } catch (error) {
      this.logger.error('Backup failed', error);
      throw error;
    }
  }

  async restoreBackup(backupFileName: string): Promise<void> {
    try {
      const backupFile = join(this.backupPath, backupFileName);

      if (!existsSync(backupFile)) {
        throw new Error('Backup file not found');
      }

      copyFileSync(backupFile, this.dbPath);
      this.logger.log(`Database restored from: ${backupFile}`);
    } catch (error) {
      this.logger.error('Restore failed', error);
      throw error;
    }
  }
}
