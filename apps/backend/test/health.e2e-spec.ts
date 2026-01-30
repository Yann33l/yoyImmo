import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from './../src/common/filters/http-exception.filter';

describe('Health (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    
    const logger = app.get(WINSTON_MODULE_PROVIDER);
    app.useGlobalFilters(new HttpExceptionFilter(logger));

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/api/v1/health (GET)', () => {
    it('should return 200 with status ok and timestamp', () => {
      return request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'ok');
          expect(res.body).toHaveProperty('timestamp');
          expect(new Date(res.body.timestamp)).toBeInstanceOf(Date);
        });
    });

    it('should return valid ISO8601 timestamp', () => {
      return request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200)
        .expect((res) => {
          const timestamp = res.body.timestamp;
          expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
        });
    });
  });

  describe('Error handling', () => {
    it('should return standardized error format for non-existent route', () => {
      return request(app.getHttpServer())
        .get('/api/v1/nonexistent')
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 404);
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('errors');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('path', '/api/v1/nonexistent');
          expect(Array.isArray(res.body.errors)).toBe(true);
        });
    });
  });

  describe('Winston logging', () => {
    it('should write errors to error.log file', async () => {
      const fs = require('fs');
      const path = require('path');
      
      const logPath = path.resolve(process.cwd(), '../../yoyimmo-data/logs/error.log');
      
      // Clear log file
      if (fs.existsSync(logPath)) {
        fs.writeFileSync(logPath, '');
      }
      
      // Trigger an error
      await request(app.getHttpServer())
        .get('/api/v1/nonexistent')
        .expect(404);
      
      // Wait for async log write
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify log file was written
      const logContent = fs.readFileSync(logPath, 'utf8');
      expect(logContent.length).toBeGreaterThan(0);
      expect(logContent).toContain('GET /api/v1/nonexistent');
    });
  });
});
