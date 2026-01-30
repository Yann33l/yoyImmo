import { Test, TestingModule } from '@nestjs/testing';
import { BackupService } from './backup.service';

// Mock modules before importing
jest.mock('archiver');
jest.mock('extract-zip');
jest.mock('fs/promises');
jest.mock('fs');
jest.mock('crypto');

import archiver from 'archiver';
import extract from 'extract-zip';
import * as fs from 'fs/promises';
import { createWriteStream, createReadStream } from 'fs';
import * as crypto from 'crypto';

describe('BackupService', () => {
  let service: BackupService;
  const mockBackupPath = '/app/data/backups';

  // Mock implementations
  const mockArchive = {
    pipe: jest.fn(),
    directory: jest.fn(),
    finalize: jest.fn(),
    pointer: jest.fn().mockReturnValue(1024000),
    on: jest.fn(),
  };

  const mockWriteStream = {
    on: jest.fn(),
  };

  const mockReadStream = {
    on: jest.fn(),
  };

  const mockHash = {
    update: jest.fn(),
    digest: jest.fn().mockReturnValue('abc123checksum'),
  };

  beforeEach(async () => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup archiver mock
    (archiver as unknown as jest.Mock).mockReturnValue(mockArchive);
    (createWriteStream as jest.Mock).mockReturnValue(mockWriteStream);
    (createReadStream as jest.Mock).mockReturnValue(mockReadStream);
    (crypto.createHash as jest.Mock).mockReturnValue(mockHash);

    // Setup common fs mocks
    (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
    (fs.access as jest.Mock).mockResolvedValue(undefined);
    (fs.readdir as jest.Mock).mockResolvedValue([]);
    (fs.stat as jest.Mock).mockResolvedValue({ mtimeMs: Date.now() });
    (fs.rm as jest.Mock).mockResolvedValue(undefined);
    (fs.rename as jest.Mock).mockResolvedValue(undefined);

    const module: TestingModule = await Test.createTestingModule({
      providers: [BackupService],
    }).compile();

    service = module.get<BackupService>(BackupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBackup', () => {
    it('should create a ZIP archive with date and timestamp in filename', async () => {
      // Setup: Make archiver emit 'close' event to resolve promise
      mockArchive.on.mockImplementation((event, callback) => {
        if (event === 'close') {
          setTimeout(() => callback(), 0);
        }
        return mockArchive;
      });
      mockWriteStream.on.mockImplementation((event, callback) => {
        if (event === 'close') {
          setTimeout(() => callback(), 0);
        }
        return mockWriteStream;
      });

      const result = await service.createBackup();

      expect(result).toContain('yoyimmo-backup-');
      expect(result).toContain('.zip');
      expect(result).toContain(mockBackupPath);
      expect(fs.mkdir).toHaveBeenCalledWith(mockBackupPath, {
        recursive: true,
      });
    });

    it('should include database and documents directories in backup', async () => {
      mockArchive.on.mockImplementation((event, callback) => {
        if (event === 'close') {
          setTimeout(() => callback(), 0);
        }
        return mockArchive;
      });
      mockWriteStream.on.mockReturnValue(mockWriteStream);

      await service.createBackup();

      expect(mockArchive.directory).toHaveBeenCalledWith(
        expect.stringContaining('database'),
        'database',
      );
      expect(mockArchive.directory).toHaveBeenCalledWith(
        expect.stringContaining('documents'),
        'documents',
      );
      expect(mockArchive.finalize).toHaveBeenCalled();
    });

    it('should handle archiver errors and reject promise', async () => {
      const testError = new Error('Archive creation failed');
      mockArchive.on.mockImplementation((event, callback) => {
        if (event === 'error') {
          setTimeout(() => callback(testError), 0);
        }
        return mockArchive;
      });

      await expect(service.createBackup()).rejects.toThrow(
        'Archive creation failed',
      );
    });
  });

  describe('rotateOldBackups', () => {
    it('should delete backups older than 30 days', async () => {
      const oldDate = Date.now() - 31 * 24 * 60 * 60 * 1000;
      (fs.readdir as jest.Mock).mockResolvedValue([
        'old-backup.zip',
        'recent-backup.zip',
      ]);
      (fs.stat as jest.Mock).mockImplementation((filepath) => {
        if (filepath.includes('old-backup')) {
          return Promise.resolve({ mtimeMs: oldDate });
        }
        return Promise.resolve({ mtimeMs: Date.now() });
      });

      await service.rotateOldBackups();

      expect(fs.unlink).toHaveBeenCalledWith(
        expect.stringContaining('old-backup.zip'),
      );
      expect(fs.unlink).not.toHaveBeenCalledWith(
        expect.stringContaining('recent-backup.zip'),
      );
    });

    it('should only process ZIP files', async () => {
      (fs.readdir as jest.Mock).mockResolvedValue([
        'backup.zip',
        'readme.txt',
        'data.json',
      ]);

      await service.rotateOldBackups();

      // Should only check stats for ZIP files
      expect(fs.stat).toHaveBeenCalledTimes(1);
      expect(fs.stat).toHaveBeenCalledWith(
        expect.stringContaining('backup.zip'),
      );
    });

    it('should handle errors during rotation gracefully without throwing', async () => {
      (fs.readdir as jest.Mock).mockRejectedValue(
        new Error('Directory not found'),
      );

      await expect(service.rotateOldBackups()).resolves.not.toThrow();
    });
  });

  describe('importBackup', () => {
    beforeEach(() => {
      // Setup successful extraction by default
      (extract as jest.Mock).mockResolvedValue(undefined);
      (fs.readdir as jest.Mock).mockResolvedValue(['yoyimmo.db']);

      // Setup checksum calculation mock
      mockReadStream.on.mockImplementation((event, callback) => {
        if (event === 'data') {
          callback(Buffer.from('test data'));
        }
        if (event === 'end') {
          setTimeout(() => callback(), 0);
        }
        return mockReadStream;
      });
    });

    it('should calculate checksum and extract ZIP file', async () => {
      const mockZipPath = '/tmp/test-backup.zip';

      // Mock createBackup for safety backup
      jest.spyOn(service, 'createBackup').mockResolvedValue('/safety.zip');

      await service.importBackup(mockZipPath);

      expect(fs.access).toHaveBeenCalledWith(mockZipPath);
      expect(crypto.createHash).toHaveBeenCalledWith('sha256');
      expect(extract).toHaveBeenCalledWith(
        mockZipPath,
        expect.objectContaining({ dir: expect.any(String) }),
      );
    });

    it('should validate ZIP contains database folder', async () => {
      const mockZipPath = '/tmp/test-backup.zip';
      (fs.access as jest.Mock).mockImplementation((path) => {
        if (path.includes('database')) {
          return Promise.reject(new Error('Database not found'));
        }
        return Promise.resolve();
      });

      await expect(service.importBackup(mockZipPath)).rejects.toThrow();
    });

    it('should validate database folder is not empty', async () => {
      const mockZipPath = '/tmp/test-backup.zip';
      (fs.readdir as jest.Mock).mockResolvedValue([]); // Empty directory

      jest.spyOn(service, 'createBackup').mockResolvedValue('/safety.zip');

      await expect(service.importBackup(mockZipPath)).rejects.toThrow(
        'Invalid backup: database folder is empty',
      );
    });

    it('should validate database file exists', async () => {
      const mockZipPath = '/tmp/test-backup.zip';
      (fs.readdir as jest.Mock).mockResolvedValue(['readme.txt']); // No .db file

      jest.spyOn(service, 'createBackup').mockResolvedValue('/safety.zip');

      await expect(service.importBackup(mockZipPath)).rejects.toThrow(
        'Invalid backup: no database file found',
      );
    });

    it('should create safety backup before replacing data', async () => {
      const mockZipPath = '/tmp/test-backup.zip';
      const createBackupSpy = jest
        .spyOn(service, 'createBackup')
        .mockResolvedValue('/safety.zip');

      await service.importBackup(mockZipPath);

      expect(createBackupSpy).toHaveBeenCalled();
    });

    it('should rollback on failure during data replacement', async () => {
      const mockZipPath = '/tmp/test-backup.zip';
      jest.spyOn(service, 'createBackup').mockResolvedValue('/safety.zip');

      // Make the second rename (new data to dest) fail
      let renameCallCount = 0;
      (fs.rename as jest.Mock).mockImplementation(() => {
        renameCallCount++;
        if (renameCallCount === 2) {
          return Promise.reject(new Error('Rename failed'));
        }
        return Promise.resolve();
      });

      await expect(service.importBackup(mockZipPath)).rejects.toThrow(
        'Rename failed',
      );

      // Verify rollback was attempted (rename backup back to original)
      expect(fs.rename).toHaveBeenCalledWith(
        expect.stringContaining('.backup'),
        expect.stringContaining('database'),
      );
    });
  });

  describe('calculateChecksum', () => {
    it('should calculate SHA256 hash of file', async () => {
      mockReadStream.on.mockImplementation((event, callback) => {
        if (event === 'data') {
          callback(Buffer.from('test data'));
        }
        if (event === 'end') {
          setTimeout(() => callback(), 0);
        }
        return mockReadStream;
      });

      // Access private method for testing
      const result = await service['calculateChecksum']('/test/file.zip');

      expect(crypto.createHash).toHaveBeenCalledWith('sha256');
      expect(mockHash.update).toHaveBeenCalled();
      expect(result).toBe('abc123checksum');
    });

    it('should handle read stream errors', async () => {
      const testError = new Error('Read failed');
      mockReadStream.on.mockImplementation((event, callback) => {
        if (event === 'error') {
          setTimeout(() => callback(testError), 0);
        }
        return mockReadStream;
      });

      await expect(
        service['calculateChecksum']('/test/file.zip'),
      ).rejects.toThrow('Read failed');
    });
  });
});
