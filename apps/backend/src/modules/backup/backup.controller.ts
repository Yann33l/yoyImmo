import { Controller, Post, Body } from '@nestjs/common';
import { BackupService } from './backup.service';

@Controller('api/backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post('create')
  async createBackup() {
    const backupFile = await this.backupService.createBackup();
    return {
      message: 'Backup created successfully',
      file: backupFile,
    };
  }

  @Post('restore')
  async restoreBackup(@Body('fileName') fileName: string) {
    await this.backupService.restoreBackup(fileName);
    return {
      message: 'Database restored successfully',
    };
  }
}
