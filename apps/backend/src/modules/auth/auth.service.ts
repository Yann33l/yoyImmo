import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly saltRounds = 10;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;
    const normalizedEmail = email.trim().toLowerCase();

    try {
      // Hash password
      const passwordHash = await bcrypt.hash(password, this.saltRounds);

      // Try to create user directly to avoid race conditions; handle unique constraint error
      const user = await this.prisma.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });

      // Log user id instead of email to avoid leaking PII in logs
      this.logger.log(`User registered: id=${user.id}`);

      return user;
    } catch (error) {
      // Handle Prisma unique constraint violation (race condition)
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email already exists');
      }

      // Re-throw known exceptions
      if (error instanceof ConflictException) {
        throw error;
      }

      // Log unexpected errors without exposing PII
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Registration failed: ${errorMessage}`, errorStack);

      // Return a generic 500 to the client
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const normalizedEmail = email.trim().toLowerCase();

    try {
      // Find user by email and select passwordHash explicitly
      const user = await this.prisma.user.findUnique({
        where: { email: normalizedEmail },
        select: { id: true, email: true, passwordHash: true },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate tokens (short-lived access token, longer refresh token)
      const payload = { sub: user.id, email: user.email };
      const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: '7d',
      });

      this.logger.log(`User logged in: id=${user.id}`);

      return {
        user: {
          id: user.id,
          email: user.email,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      // Re-throw known exceptions
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // Log unexpected errors without PII
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Login failed: ${errorMessage}`, errorStack);

      // Return a generic 500 to the client
      throw new InternalServerErrorException('Login failed');
    }
  }
}