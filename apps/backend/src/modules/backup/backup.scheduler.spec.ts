import { Test, TestingModule } from '@nestjs/testing';
import { BackupScheduler } from './backup.scheduler';
import { BackupService } from './backup.service';

describe('BackupScheduler', () => {
  let scheduler: BackupScheduler;
  let backupService: BackupService;

  beforeEach(async () => {
    // Mock BackupService
    const mockBackupService = {
      createBackup: jest.fn().mockResolvedValue('/app/data/backups/test-backup.zip'),
      rotateOldBackups: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BackupScheduler,
        {
          provide: BackupService,
          useValue: mockBackupService,
        },
      ],
    }).compile();

    scheduler = module.get<BackupScheduler>(BackupScheduler);
    backupService = module.get<BackupService>(BackupService);
  });

  it('should be defined', () => {
    expect(scheduler).toBeDefined();
  });

  describe('handleDailyBackup', () => {
    it('should call createBackup on backup service', async () => {
      await scheduler.handleDailyBackup();

      expect(backupService.createBackup).toHaveBeenCalled();
    });

    it('should call rotateOldBackups after creating backup', async () => {
      await scheduler.handleDailyBackup();

      expect(backupService.createBackup).toHaveBeenCalled();
      expect(backupService.rotateOldBackups).toHaveBeenCalled();
    });

    it('should handle errors gracefully and not throw', async () => {
      // Mock createBackup to throw an error
      jest
        .spyOn(backupService, 'createBackup')
        .mockRejectedValue(new Error('Backup failed'));

      // Should not throw even if backup fails
      await expect(scheduler.handleDailyBackup()).resolves.not.toThrow();
    });

    it('should log execution timestamp', async () => {
      const logSpy = jest.spyOn(scheduler['logger'], 'log');

      await scheduler.handleDailyBackup();

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Starting automatic daily backup'),
      );
    });

    it('should log completion after successful backup', async () => {
      const logSpy = jest.spyOn(scheduler['logger'], 'log');

      await scheduler.handleDailyBackup();

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Daily backup completed'),
      );
    });

    it('should log error if backup fails', async () => {
      const errorSpy = jest.spyOn(scheduler['logger'], 'error');
      jest
        .spyOn(backupService, 'createBackup')
        .mockRejectedValue(new Error('Test error'));

      await scheduler.handleDailyBackup();

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Daily backup failed'),
      );
    });
  });
});
