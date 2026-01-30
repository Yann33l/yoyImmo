import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../../database/prisma.service';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'Password123',
    };

    const hashedPassword = '$2b$10$hashedpassword';
    const createdUser = {
      id: 'uuid-123',
      email: 'test@example.com',
      createdAt: new Date('2026-01-28T12:00:00Z'),
    };

    it('should successfully register a new user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.user.create.mockResolvedValue(createdUser);

      const result = await service.register(registerDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          passwordHash: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });
      expect(result).toEqual(createdUser);
    });

    it('should return user without passwordHash', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.user.create.mockResolvedValue(createdUser);

      const result = await service.register(registerDto);

      expect(result).not.toHaveProperty('passwordHash');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('createdAt');
    });

    it('should throw ConflictException if email already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'existing-user',
        email: registerDto.email,
        passwordHash: 'existing-hash',
        createdAt: new Date(),
      });

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.register(registerDto)).rejects.toThrow(
        'Email already exists',
      );
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });

    it('should hash password with 10 salt rounds', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.user.create.mockResolvedValue(createdUser);

      await service.register(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
    });

    it('should not store plain text password', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.user.create.mockResolvedValue(createdUser);

      await service.register(registerDto);

      const createCall = mockPrismaService.user.create.mock.calls[0][0];
      expect(createCall.data.passwordHash).toBe(hashedPassword);
      expect(createCall.data.passwordHash).not.toBe(registerDto.password);
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'Password123',
    };

    const existingUser = {
      id: 'uuid-123',
      email: 'test@example.com',
      passwordHash: '$2b$10$hashedpassword',
      createdAt: new Date('2026-01-28T12:00:00Z'),
    };

    const mockAccessToken = 'mock.access.token';
    const mockRefreshToken = 'mock.refresh.token';

    it('should successfully login and return user with tokens', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign
        .mockReturnValueOnce(mockAccessToken)
        .mockReturnValueOnce(mockRefreshToken);

      const result = await service.login(loginDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        existingUser.passwordHash,
      );
      expect(result).toEqual({
        user: {
          id: existingUser.id,
          email: existingUser.email,
        },
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      });
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('should call bcrypt.compare with correct arguments', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign
        .mockReturnValueOnce(mockAccessToken)
        .mockReturnValueOnce(mockRefreshToken);

      await service.login(loginDto);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        existingUser.passwordHash,
      );
    });

    it('should generate access and refresh tokens with correct payload', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign
        .mockReturnValueOnce(mockAccessToken)
        .mockReturnValueOnce(mockRefreshToken);

      await service.login(loginDto);

      const expectedPayload = {
        sub: existingUser.id,
        email: existingUser.email,
      };

      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
      expect(mockJwtService.sign).toHaveBeenNthCalledWith(1, expectedPayload);
      expect(mockJwtService.sign).toHaveBeenNthCalledWith(2, expectedPayload, {
        expiresIn: '7d',
      });
    });

    it('should return user without passwordHash', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign
        .mockReturnValueOnce(mockAccessToken)
        .mockReturnValueOnce(mockRefreshToken);

      const result = await service.login(loginDto);

      expect(result.user).not.toHaveProperty('passwordHash');
      expect(result.user).toHaveProperty('id');
      expect(result.user).toHaveProperty('email');
    });
  });
});
