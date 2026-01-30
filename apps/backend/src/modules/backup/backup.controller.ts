import {
  Controller,
  Post,
  Res,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { BackupService } from './backup.service';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';

@ApiTags('backup')
@Controller('backup')
export class BackupController {
  private readonly logger = new Logger(BackupController.name);

  constructor(private readonly backupService: BackupService) {}

  /**
   * Extracts error message from unknown error type
   * @param error Unknown error object
   * @returns Error message string
   */
  private getErrorMessage(error: unknown): string {
    return this.getErrorMessage(error);
  }

  /**
   * Manual backup export endpoint
   * Generates a backup ZIP and returns it for download
   */
  @Post('export')
  @ApiOperation({ summary: 'Generate and download backup ZIP' })
  @ApiResponse({ status: 200, description: 'Backup ZIP file' })
  @ApiResponse({ status: 500, description: 'Backup export failed' })
  async exportBackup(@Res() res: Response) {
    try {
      this.logger.log('Manual backup export requested');

      // Generate backup
      const filepath = await this.backupService.createBackup();
      const filename = filepath.split('/').pop() || filepath.split('\\').pop();

      this.logger.log(`Manual backup created: ${filename}`);

      // Send file for download
      res.download(filepath, filename, (err) => {
        if (err) {
          this.logger.error(`Download failed: ${this.getErrorMessage(err)}`);
          // Note: Cannot throw HttpException here as response already sent
          // Error is already logged for debugging
        }
      });
    } catch (error) {
      this.logger.error(`Export failed: ${this.getErrorMessage(error)}`);
      throw new HttpException(
        'Backup export failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Backup import/restore endpoint
   * Accepts a ZIP file and restores data from it
   */
  @Post('import')
  @ApiOperation({ summary: 'Import backup ZIP and restore data' })
  @ApiResponse({ status: 200, description: 'Backup imported successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file or format' })
  @ApiResponse({ status: 413, description: 'File too large (max 500MB)' })
  @ApiResponse({ status: 500, description: 'Import failed' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 500 * 1024 * 1024, // 500MB max
      },
    }),
  )
  async importBackup(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    if (!file.originalname.endsWith('.zip')) {
      throw new HttpException(
        'Invalid file format. ZIP required.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      this.logger.log(`Import backup requested: ${file.originalname}`);

      await this.backupService.importBackup(file.path);

      this.logger.log('Backup restored successfully');

      return {
        message: 'Backup restored successfully',
        filename: file.originalname,
      };
    } catch (error) {
      this.logger.error(
        `Import failed: ${this.getErrorMessage(error)}`,
      );
      throw new HttpException(
        `Import failed: ${this.getErrorMessage(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
