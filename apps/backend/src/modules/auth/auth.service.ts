import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

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

    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, this.saltRounds);

      // Create user
      const user = await this.prisma.user.create({
        data: {
          email,
          passwordHash,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });

      this.logger.log(`User registered: ${email}`);

      return user;
    } catch (error) {
      // Re-throw known exceptions
      if (error instanceof ConflictException) {
        throw error;
      }

      // Log unexpected errors without exposing PII
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Registration failed: ${errorMessage}`, errorStack);
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      // Find user by email
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate tokens
      const payload = { sub: user.id, email: user.email };
      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: '7d',
      });

      this.logger.log(`User logged in: ${email}`);

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
      throw error;
    }
  }
}
