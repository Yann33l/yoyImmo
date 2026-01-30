import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/database/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
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
    await app.init();

    prismaService = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean up test data before each test
    await prismaService.user.deleteMany({
      where: {
        email: {
          contains: 'test',
        },
      },
    });
  });

  describe('POST /api/v1/auth/register', () => {
    const validRegistration = {
      email: 'test@example.com',
      password: 'Password123',
    };

    it('should register a new user with valid data and return 201', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(validRegistration)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', validRegistration.email);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).not.toHaveProperty('password');
      expect(response.body).not.toHaveProperty('passwordHash');
    });

    it('should create user in database', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(validRegistration)
        .expect(201);

      const user = await prismaService.user.findUnique({
        where: { email: validRegistration.email },
      });

      expect(user).toBeDefined();
      expect(user.email).toBe(validRegistration.email);
      expect(user.passwordHash).toBeDefined();
      expect(user.passwordHash).not.toBe(validRegistration.password);
    });

    it('should return 400 with invalid email format', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Password123',
        })
        .expect(400);

      expect(response.body.message).toContain('Invalid email format');
    });

    it('should return 400 with password less than 8 characters', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Pass1',
        })
        .expect(400);

      expect(response.body.message).toContain(
        'Password must be at least 8 characters long',
      );
    });

    it('should return 400 with password without uppercase letter', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(400);

      expect(response.body.message).toContain(
        'Password must contain at least 1 uppercase letter and 1 number',
      );
    });

    it('should return 400 with password without number', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'PasswordABC',
        })
        .expect(400);

      expect(response.body.message).toContain(
        'Password must contain at least 1 uppercase letter and 1 number',
      );
    });

    it('should return 409 when registering with duplicate email', async () => {
      // First registration
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(validRegistration)
        .expect(201);

      // Second registration with same email
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(validRegistration)
        .expect(409);

      expect(response.body.message).toBe('Email already exists');
    });

    it('should return 400 when email is missing', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          password: 'Password123',
        })
        .expect(400);
    });

    it('should return 400 when password is missing', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
        })
        .expect(400);
    });

    it('should return 400 when extra fields are provided (forbidNonWhitelisted)', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123',
          extraField: 'should not be allowed',
        })
        .expect(400);
    });
  });
});
