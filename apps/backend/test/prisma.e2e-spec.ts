import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/database/prisma.service';
import { PrismaModule } from '../src/database/prisma.module';

describe('Prisma Integration (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterEach(async () => {
    // Clean up test data
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('User Model CRUD Operations', () => {
    it('should create a new user', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          passwordHash: 'hashed_password_123',
        },
      });

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.passwordHash).toBe('hashed_password_123');
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should read a user by id', async () => {
      const createdUser = await prisma.user.create({
        data: {
          email: 'read@example.com',
          passwordHash: 'hashed_password_456',
        },
      });

      const foundUser = await prisma.user.findUnique({
        where: { id: createdUser.id },
      });

      expect(foundUser).toBeDefined();
      expect(foundUser?.email).toBe('read@example.com');
    });

    it('should update a user', async () => {
      const createdUser = await prisma.user.create({
        data: {
          email: 'update@example.com',
          passwordHash: 'old_password',
        },
      });

      const updatedUser = await prisma.user.update({
        where: { id: createdUser.id },
        data: { passwordHash: 'new_password' },
      });

      expect(updatedUser.passwordHash).toBe('new_password');
      expect(updatedUser.email).toBe('update@example.com');
    });

    it('should delete a user', async () => {
      const createdUser = await prisma.user.create({
        data: {
          email: 'delete@example.com',
          passwordHash: 'password_to_delete',
        },
      });

      await prisma.user.delete({
        where: { id: createdUser.id },
      });

      const deletedUser = await prisma.user.findUnique({
        where: { id: createdUser.id },
      });

      expect(deletedUser).toBeNull();
    });

    it('should enforce unique email constraint', async () => {
      await prisma.user.create({
        data: {
          email: 'unique@example.com',
          passwordHash: 'password1',
        },
      });

      await expect(
        prisma.user.create({
          data: {
            email: 'unique@example.com',
            passwordHash: 'password2',
          },
        }),
      ).rejects.toThrow();
    });

    it('should list all users', async () => {
      await prisma.user.createMany({
        data: [
          { email: 'user1@example.com', passwordHash: 'pass1' },
          { email: 'user2@example.com', passwordHash: 'pass2' },
          { email: 'user3@example.com', passwordHash: 'pass3' },
        ],
      });

      const users = await prisma.user.findMany();
      expect(users).toHaveLength(3);
    });
  });
});
