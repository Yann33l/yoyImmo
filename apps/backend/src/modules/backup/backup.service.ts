import { Injectable, Logger } from '@nestjs/common';
import archiver from 'archiver';
import extract from 'extract-zip';
import * as fs from 'fs/promises';
import * as path from 'path';
import { createWriteStream, createReadStream } from 'fs';
import * as crypto from 'crypto';

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  private readonly dataPath = '/app/data';
  private readonly backupPath = '/app/data/backups';

  /**
   * Extracts error message from unknown error type
   * @param error Unknown error object
   * @returns Error message string
   */
  private getErrorMessage(error: unknown): string {
    return this.getErrorMessage(error);
  }

  /**
   * Creates a ZIP backup of /app/data directory
   * @returns Path to the created backup file
   */
  async createBackup(): Promise<string> {
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const timestamp = now.getTime(); // Unix timestamp for uniqueness
    const filename = `yoyimmo-backup-${date}-${timestamp}.zip`;
    const filepath = path.join(this.backupPath, filename);

    // Ensure backups directory exists
    await fs.mkdir(this.backupPath, { recursive: true });

    return new Promise((resolve, reject) => {
      const output = createWriteStream(filepath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
        this.logger.log(
          `Backup created: ${filename} (${archive.pointer()} bytes)`,
        );
        resolve(filepath);
      });

      archive.on('error', (err) => {
        this.logger.error(`Backup failed: ${err.message}`);
        reject(err);
      });

      archive.pipe(output);

      // Add database directory
      const databasePath = path.join(this.dataPath, 'database');
      archive.directory(databasePath, 'database');

      // Add documents directory if it exists
      const documentsPath = path.join(this.dataPath, 'documents');
      archive.directory(documentsPath, 'documents');

      archive.finalize();
    });
  }

  /**
   * Calculates SHA256 checksum of a file
   * @param filePath Path to the file
   * @returns SHA256 checksum as hex string
   */
  private async calculateChecksum(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = createReadStream(filePath);

      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', (err) => reject(err));
    });
  }

  /**
   * Deletes backup files older than 30 days
   */
  async rotateOldBackups(): Promise<void> {
    try {
      const files = await fs.readdir(this.backupPath);
      const now = Date.now();
      const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

      for (const file of files) {
        if (!file.endsWith('.zip')) continue;

        const filepath = path.join(this.backupPath, file);
        const stats = await fs.stat(filepath);

        if (stats.mtimeMs < thirtyDaysAgo) {
          await fs.unlink(filepath);
          this.logger.log(`Deleted old backup: ${file}`);
        }
      }
    } catch (error) {
      this.logger.error(
        `Rotation failed: ${this.getErrorMessage(error)}`,
      );
      // Don't throw - allow service to continue
    }
  }

  /**
   * Imports and restores a backup ZIP file
   * @param zipPath Path to the backup ZIP file
   */
  async importBackup(zipPath: string): Promise<void> {
    // Validate ZIP exists and calculate checksum for integrity
    await fs.access(zipPath);
    const zipChecksum = await this.calculateChecksum(zipPath);
    this.logger.log(`Importing backup with checksum: ${zipChecksum}`);

    // Extract to temporary directory first
    const tempDir = path.join(this.dataPath, 'temp-restore');
    await fs.mkdir(tempDir, { recursive: true });

    try {
      // Extract ZIP
      await extract(zipPath, { dir: tempDir });

      // Validate structure (must contain database/)
      const databasePath = path.join(tempDir, 'database');
      await fs.access(databasePath);

      // Validate database integrity by checking it's not empty
      const dbFiles = await fs.readdir(databasePath);
      if (dbFiles.length === 0) {
        throw new Error('Invalid backup: database folder is empty');
      }

      // Verify database file exists and is valid SQLite
      const dbFile = dbFiles.find((f) => f.endsWith('.db'));
      if (!dbFile) {
        throw new Error('Invalid backup: no database file found');
      }

      // Calculate checksum of extracted database for integrity verification
      const extractedDbChecksum = await this.calculateChecksum(
        path.join(databasePath, dbFile),
      );
      this.logger.log(
        `Database file integrity verified: ${extractedDbChecksum}`,
      );

      // Create safety backup before replacing (for rollback)
      const safetyBackupPath = await this.createBackup();
      this.logger.log(
        `Safety backup created at: ${safetyBackupPath} (for rollback if needed)`,
      );

      // Replace existing data
      const databaseDest = path.join(this.dataPath, 'database');
      const documentsDest = path.join(this.dataPath, 'documents');
      const databaseBackup = path.join(this.dataPath, 'database.backup');
      const documentsBackup = path.join(this.dataPath, 'documents.backup');

      try {
        // Move current database to backup location (for quick rollback)
        await fs.rename(databaseDest, databaseBackup);

        // Move new database into place
        await fs.rename(path.join(tempDir, 'database'), databaseDest);

        // Replace documents if exists in backup
        try {
          await fs.access(path.join(tempDir, 'documents'));
          // Backup current documents if they exist
          try {
            await fs.access(documentsDest);
            await fs.rename(documentsDest, documentsBackup);
          } catch {
            // No existing documents, that's fine
          }
          await fs.rename(path.join(tempDir, 'documents'), documentsDest);
        } catch {
          this.logger.warn('No documents folder in backup');
        }

        // Success - cleanup backup copies
        await fs.rm(databaseBackup, { recursive: true, force: true });
        try {
          await fs.rm(documentsBackup, { recursive: true, force: true });
        } catch {
          // No documents backup, that's fine
        }

        this.logger.log('Backup restored successfully');
      } catch (restoreError) {
        // ROLLBACK: Restore from backup copies
        this.logger.error(
          `Restore failed, rolling back: ${restoreError instanceof Error ? restoreError.message : String(restoreError)}`,
        );

        try {
          // Restore database from backup
          await fs.rm(databaseDest, { recursive: true, force: true });
          await fs.rename(databaseBackup, databaseDest);

          // Restore documents from backup if it exists
          try {
            await fs.access(documentsBackup);
            await fs.rm(documentsDest, { recursive: true, force: true });
            await fs.rename(documentsBackup, documentsDest);
          } catch {
            // No documents backup, skip
          }

          this.logger.log('Rollback completed successfully - data restored');
        } catch (rollbackError) {
          this.logger.error(
            `CRITICAL: Rollback failed! Restore from safety backup: ${safetyBackupPath}. Error: ${rollbackError instanceof Error ? rollbackError.message : String(rollbackError)}`,
          );
        }

        throw restoreError;
      }
    } catch (error) {
      this.logger.error(
        `Import failed: ${this.getErrorMessage(error)}`,
      );
      throw error;
    } finally {
      // Cleanup temp directory
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  }
}
