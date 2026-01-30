# Story 2.2: User Login with JWT Authentication

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to log in with my email and password,
So that I can access my protected property data.

## Acceptance Criteria

**AC1: JWT Dependencies Installation**

**Given** the backend needs JWT authentication
**When** I install JWT dependencies
**Then** `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt` are added to package.json
**And** TypeScript types `@types/passport-jwt` are installed as dev dependency

**AC2: Login Endpoint with Credential Validation**

**Given** a POST endpoint `/api/v1/auth/login` exists accepting `{email, password}`
**When** I submit login credentials
**Then** the endpoint validates the input format using DTO validation
**And** verifies the email exists in the database
**And** compares the password with the stored hash using bcrypt.compare()
**And** returns 401 Unauthorized with message "Invalid credentials" if authentication fails
**And** does not reveal whether email or password is incorrect (security best practice)

**AC3: JWT Token Generation**

**Given** valid credentials are authenticated successfully
**When** the login service generates tokens
**Then** it creates a JWT access token with 15 minutes expiration
**And** creates a JWT refresh token with 7 days expiration
**And** both tokens include user payload: `{sub: userId, email: userEmail}`
**And** tokens are signed with a secure secret key from environment variables

**AC4: HttpOnly Cookie Response**

**Given** JWT tokens are generated
**When** the login response is sent
**Then** the access token is set as an httpOnly cookie named `access_token`
**And** the refresh token is set as an httpOnly cookie named `refresh_token`
**And** cookies have `httpOnly: true` (prevents JavaScript access - XSS protection)
**And** cookies have `secure: true` in production (HTTPS only)
**And** cookies have `sameSite: 'strict'` (CSRF protection)
**And** the response body returns `{user: {id, email}, message: 'Login successful'}` (no password or tokens in body)
**And** returns HTTP 200 OK status

**AC5: Invalid Credentials Handling**

**Given** invalid credentials are submitted
**When** the email doesn't exist OR password is incorrect
**Then** return 401 Unauthorized with message "Invalid credentials"
**And** use the same generic message for both cases (don't leak which field failed)
**And** log the failed attempt (without exposing password)

## Tasks / Subtasks

- [x] Task 1: Install JWT Dependencies (AC: 1)
  - [x] Subtask 1.1: Run `npm install @nestjs/jwt @nestjs/passport passport passport-jwt` in apps/backend/
  - [x] Subtask 1.2: Run `npm install -D @types/passport-jwt` for TypeScript types
  - [x] Subtask 1.3: Verify all dependencies added to package.json
  - [x] Subtask 1.4: Run `npm install` to ensure clean install

- [x] Task 2: Configure JWT Module in AuthModule (AC: 1, 3)
  - [x] Subtask 2.1: Import JwtModule in AuthModule with registerAsync()
  - [x] Subtask 2.2: Configure JWT secret from environment variable (JWT_SECRET)
  - [x] Subtask 2.3: Set access token expiration to 15 minutes ('15m')
  - [x] Subtask 2.4: Import PassportModule in AuthModule
  - [x] Subtask 2.5: Verify JWT_SECRET exists in .env file (or create with secure random value)

- [x] Task 3: Create Login DTO with Validation (AC: 2)
  - [x] Subtask 3.1: Create `src/modules/auth/dto/login.dto.ts`
  - [x] Subtask 3.2: Add email field with `@IsEmail()` decorator
  - [x] Subtask 3.3: Add password field with `@IsString()` and `@IsNotEmpty()` decorators
  - [x] Subtask 3.4: Add Swagger @ApiProperty decorators for documentation
  - [x] Subtask 3.5: Export LoginDto from dto/index.ts

- [x] Task 4: Implement Login Logic in AuthService (AC: 2, 3, 5)
  - [x] Subtask 4.1: Inject JwtService into AuthService constructor
  - [x] Subtask 4.2: Create `login(loginDto: LoginDto)` method
  - [x] Subtask 4.3: Find user by email using `prisma.user.findUnique()`
  - [x] Subtask 4.4: Throw UnauthorizedException (401) if user not found (message: "Invalid credentials")
  - [x] Subtask 4.5: Compare password with hash using `bcrypt.compare(password, user.passwordHash)`
  - [x] Subtask 4.6: Throw UnauthorizedException (401) if password incorrect (message: "Invalid credentials")
  - [x] Subtask 4.7: Generate access token with JwtService.sign({sub: user.id, email: user.email}, {expiresIn: '15m'})
  - [x] Subtask 4.8: Generate refresh token with JwtService.sign({sub: user.id, email: user.email}, {expiresIn: '7d'})
  - [x] Subtask 4.9: Return {user: {id, email}, accessToken, refreshToken}
  - [x] Subtask 4.10: Add try-catch for unexpected errors with logging (no PII exposure)

- [x] Task 5: Create Login Endpoint in AuthController (AC: 2, 4)
  - [x] Subtask 5.1: Inject Response (@Res()) to manually set cookies
  - [x] Subtask 5.2: Create POST `/auth/login` endpoint with `@Post('login')`
  - [x] Subtask 5.3: Call `authService.login(loginDto)`
  - [x] Subtask 5.4: Set access_token httpOnly cookie with response.cookie()
  - [x] Subtask 5.5: Set refresh_token httpOnly cookie with response.cookie()
  - [x] Subtask 5.6: Configure cookie options: httpOnly=true, secure=true (production), sameSite='strict'
  - [x] Subtask 5.7: Return 200 OK with {user: {id, email}, message: 'Login successful'}
  - [x] Subtask 5.8: Add Swagger @ApiOperation and @ApiResponse decorators

- [x] Task 6: Environment Configuration for JWT (AC: 3)
  - [x] Subtask 6.1: Add JWT_SECRET to apps/backend/.env
  - [x] Subtask 6.2: Add JWT_ACCESS_EXPIRATION='15m' to .env
  - [x] Subtask 6.3: Add JWT_REFRESH_EXPIRATION='7d' to .env
  - [x] Subtask 6.4: Add NODE_ENV='development' or 'production' for cookie secure flag
  - [x] Subtask 6.5: Update .env.example with all JWT variables (use placeholder values)

- [x] Task 7: Write Unit Tests for AuthService Login (AC: 2, 3, 5)
  - [x] Subtask 7.1: Update `src/modules/auth/auth.service.spec.ts`
  - [x] Subtask 7.2: Test successful login returns access/refresh tokens
  - [x] Subtask 7.3: Test login with non-existent email throws UnauthorizedException
  - [x] Subtask 7.4: Test login with incorrect password throws UnauthorizedException
  - [x] Subtask 7.5: Test bcrypt.compare is called correctly
  - [x] Subtask 7.6: Test JwtService.sign is called for both tokens with correct payloads
  - [x] Subtask 7.7: Run `npm test` and verify all tests pass

- [x] Task 8: Write E2E Tests for Login Endpoint (AC: 2, 4, 5)
  - [x] Subtask 8.1: Update `test/auth.e2e-spec.ts`
  - [x] Subtask 8.2: Test POST /api/v1/auth/login with valid credentials returns 200
  - [x] Subtask 8.3: Test response includes user object {id, email} and message
  - [x] Subtask 8.4: Test response sets access_token cookie with httpOnly flag
  - [x] Subtask 8.5: Test response sets refresh_token cookie with httpOnly flag
  - [x] Subtask 8.6: Test login with invalid email returns 401 "Invalid credentials"
  - [x] Subtask 8.7: Test login with incorrect password returns 401 "Invalid credentials"
  - [x] Subtask 8.8: Test login with missing email returns 400 validation error
  - [x] Subtask 8.9: Test login with missing password returns 400 validation error
  - [x] Subtask 8.10: Run `npm run test:e2e` and verify all tests pass

- [x] Task 9: Update Swagger Documentation (AC: 2, 4)
  - [x] Subtask 9.1: Add @ApiTags('Authentication') if not already on controller
  - [x] Subtask 9.2: Add @ApiOperation for login endpoint describing JWT authentication
  - [x] Subtask 9.3: Add @ApiBody with LoginDto type
  - [x] Subtask 9.4: Add @ApiResponse 200 showing successful login response format
  - [x] Subtask 9.5: Add @ApiResponse 401 for invalid credentials
  - [x] Subtask 9.6: Verify Swagger UI at /api/docs displays login endpoint correctly

## Dev Notes

### Architecture Compliance Requirements (CRITICAL)

**ADR-004: JWT Authentication with httpOnly Cookies**
- **Access Token**: JWT expires in 15 minutes (short-lived for security)
- **Refresh Token**: JWT expires in 7 days (allows persistent sessions)
- **Storage**: Both tokens stored as httpOnly cookies (XSS protection)
- **Cookie Security**:
  - `httpOnly: true` - Prevents JavaScript access (XSS mitigation)
  - `secure: true` (production only) - HTTPS only transmission
  - `sameSite: 'strict'` - CSRF protection
- **Token Payload**: `{sub: userId, email: userEmail}` (minimal data, no sensitive info)
- **Secret Management**: JWT_SECRET from environment variables (never hardcoded)

**ARCH-011: Authentication with JWT and bcrypt**
- Password comparison: Use `bcrypt.compare(plainPassword, hash)` to verify credentials
- Dependencies: `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `@types/passport-jwt`
- Never expose JWT tokens in response body (only in httpOnly cookies)
- Never log passwords or tokens
- Generic error messages for failed login (don't leak if email exists)

**ARCH-010: Validation**
- LoginDto uses class-validator decorators (@IsEmail, @IsString, @IsNotEmpty)
- Global ValidationPipe already configured in main.ts (Story 2.1)
- Validation errors return 400 with detailed messages
- Whitelist and forbidNonWhitelisted enabled

**ARCH-023: Backend Naming Patterns**
- Files: kebab-case (login.dto.ts, auth.service.ts, auth.controller.ts)
- Classes: PascalCase (LoginDto, AuthService, AuthController)
- Methods: camelCase (login, validateUser, generateTokens)
- Endpoints: kebab-case (/auth/login)

**ARCH-026: API Response Format**
- Success login: `{user: {id, email}, message: 'Login successful'}` (200 OK)
- Error: `{statusCode: 401, message: 'Invalid credentials', timestamp, path}`
- Never include passwords or raw tokens in response body
- Cookies set via Set-Cookie header automatically

**ARCH-016: Error Handling**
- Use UnauthorizedException for invalid credentials (401)
- Use BadRequestException for validation errors (400) - handled by ValidationPipe
- Global Exception Filter formats all errors consistently (from Story 1.4)
- Log failed login attempts without exposing passwords

### Previous Story Intelligence

**Story 2.1 - User Registration:**
- ✅ AuthModule already exists in `src/modules/auth/`
- ✅ AuthService and AuthController already created
- ✅ PrismaModule imported into AuthModule
- ✅ User model exists in Prisma schema with email (unique) and passwordHash
- ✅ bcrypt dependency already installed (used for password hashing)
- ✅ Global ValidationPipe configured in main.ts
- ✅ API versioning prefix `/api/v1` already set
- ✅ Swagger already configured and accessible at `/api/docs`
- ✅ Unit and E2E test patterns established (auth.service.spec.ts, auth.e2e-spec.ts)

**Key Patterns from Story 2.1:**
- **DTO Pattern**: RegisterDto with class-validator decorators + Swagger @ApiProperty
- **Service Pattern**: Async methods with try-catch, dependency injection of PrismaService
- **Controller Pattern**: `@Controller('v1/auth')` with Swagger decorators
- **Error Handling**: ConflictException for duplicate email (409)
- **Testing Pattern**: Mock PrismaService in unit tests, real database in E2E tests
- **Logging Pattern**: Winston logger without PII exposure

**Story 1.4 - Core Infrastructure:**
- Global Exception Filter configured
- Winston logging framework integrated
- Swagger API documentation on `/api/docs`
- Standardized error responses

**Story 1.2 - Prisma ORM Setup:**
- PrismaService available as injectable provider
- Database file: `../../yoyimmo-data/database/yoyimmo.db`
- Migration workflow: `npx prisma migrate dev`

### File Structure for This Story

```
apps/backend/
├── .env                                    # UPDATE: Add JWT_SECRET, JWT_*_EXPIRATION, NODE_ENV
├── .env.example                            # UPDATE: Add JWT environment variable examples
├── src/
│   ├── main.ts                             # No changes (global ValidationPipe already configured)
│   └── modules/
│       └── auth/                           # EXISTING MODULE (from Story 2.1)
│           ├── auth.module.ts              # UPDATE: Import JwtModule, PassportModule
│           ├── auth.service.ts             # UPDATE: Add login() method, inject JwtService
│           ├── auth.service.spec.ts        # UPDATE: Add login tests
│           ├── auth.controller.ts          # UPDATE: Add login endpoint with cookie handling
│           └── dto/
│               ├── login.dto.ts            # CREATE: Login DTO with validation
│               ├── register.dto.ts         # EXISTING (from Story 2.1)
│               └── index.ts                # UPDATE: Export LoginDto
└── test/
    └── auth.e2e-spec.ts                    # UPDATE: Add login E2E tests
```

### Technical Implementation Details

**JWT Module Configuration (auth.module.ts):**
```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
```

**LoginDto (dto/login.dto.ts):**
```typescript
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePass123',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
```

**AuthService login() method:**
```typescript
import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

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
      const accessToken = this.jwtService.sign(payload, {
        expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m',
      });
      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
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
```

**AuthController login endpoint:**
```typescript
import { Controller, Post, Body, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful, tokens set as httpOnly cookies',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
          },
        },
        message: { type: 'string', example: 'Login successful' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, accessToken, refreshToken } = await this.authService.login(loginDto);

    // Set httpOnly cookies
    const isProduction = process.env.NODE_ENV === 'production';

    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
    });

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    return {
      user,
      message: 'Login successful',
    };
  }
}
```

**Environment Variables (.env):**
```bash
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Application Environment
NODE_ENV=development
```

### Security Considerations

**Password Security:**
- Use bcrypt.compare() for constant-time comparison (prevents timing attacks)
- Never log passwords or password hashes
- Never return passwords in API responses
- Generic "Invalid credentials" message (don't reveal if email exists or password wrong)

**JWT Token Security:**
- Store tokens ONLY in httpOnly cookies (not localStorage/sessionStorage - XSS vulnerable)
- Use secure flag in production (HTTPS only)
- Use sameSite: strict (CSRF protection)
- Short-lived access tokens (15 minutes) limit damage if compromised
- Refresh tokens allow session persistence without compromising security
- JWT_SECRET must be strong (64+ chars random string) and environment-specific

**Cookie Security:**
- httpOnly: true prevents XSS attacks (JavaScript can't access cookies)
- secure: true ensures cookies only sent over HTTPS in production
- sameSite: 'strict' prevents CSRF attacks
- Appropriate maxAge set for token expiration

**Error Message Security:**
- Don't reveal whether email exists in database ("Invalid credentials" for both cases)
- Don't expose stack traces in production
- Log failures server-side only (without PII)

### Testing Requirements

**Unit Tests (auth.service.spec.ts):**
- Test successful login returns user + access/refresh tokens
- Test non-existent email throws UnauthorizedException with "Invalid credentials"
- Test incorrect password throws UnauthorizedException with "Invalid credentials"
- Test bcrypt.compare is called correctly
- Test JwtService.sign is called twice (access + refresh tokens)
- Test token payload includes {sub: userId, email: userEmail}
- Mock PrismaService and JwtService for isolation

**E2E Tests (auth.e2e-spec.ts):**
- Test POST /api/v1/auth/login with valid credentials returns 200
- Test response includes {user: {id, email}, message: 'Login successful'}
- Test access_token cookie is set with httpOnly flag
- Test refresh_token cookie is set with httpOnly flag
- Test login with non-existent email returns 401 "Invalid credentials"
- Test login with incorrect password returns 401 "Invalid credentials"
- Test login with missing email returns 400 validation error
- Test login with missing password returns 400 validation error
- Test login with invalid email format returns 400 validation error
- Test multiple logins work correctly (tokens refreshed)

**Test Coverage Target:**
- AuthService.login(): > 90% coverage (all branches including error paths)
- AuthController.login: > 80% coverage
- Integration: All acceptance criteria validated

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 2: User Authentication & Data Security]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.2: User Login with JWT Authentication]
- [Source: _bmad-output/planning-artifacts/architecture.md#ADR-004: Authentification - JWT avec httpOnly Cookies]
- [Source: _bmad-output/implementation-artifacts/2-1-user-registration-with-password-hashing.md - Auth module setup and patterns]
- [Source: NestJS JWT Documentation - https://docs.nestjs.com/security/authentication]
- [Source: NestJS Passport Documentation - https://docs.nestjs.com/recipes/passport]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

- Fixed TypeScript error in auth.module.ts: Changed `expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m'` to `expiresIn: '15m'` (hardcoded) because JWT signOptions.expiresIn requires specific type
- Fixed E2E test cookie type issues: Added type assertion for `response.headers['set-cookie']` to handle both string and string[] types

### Completion Notes List

- ✅ All 9 tasks completed with all subtasks
- ✅ JWT dependencies installed: @nestjs/jwt@11.0.2, @nestjs/passport@11.0.5, passport@0.7.0, passport-jwt@4.0.1, @types/passport-jwt@4.0.1
- ✅ JWT Module configured in AuthModule with PassportModule and JwtModule.registerAsync()
- ✅ Environment variables configured: JWT_SECRET (64-char random), JWT_ACCESS_EXPIRATION=15m, JWT_REFRESH_EXPIRATION=7d, NODE_ENV=development
- ✅ LoginDto created with @IsEmail and @IsNotEmpty validation + Swagger @ApiProperty decorators
- ✅ AuthService.login() implemented: bcrypt password verification, JWT token generation (access 15min, refresh 7days), generic error messages
- ✅ AuthController.login endpoint created: POST /api/v1/auth/login with httpOnly cookie handling (access_token, refresh_token)
- ✅ Cookie security configured: httpOnly=true, secure=production, sameSite=strict
- ✅ Unit tests: 12 tests passing (6 register + 6 login) - auth.service.spec.ts
- ✅ E2E tests: 20 tests passing (10 register + 10 login) - auth.e2e-spec.ts
- ✅ All existing tests still pass (no regressions)
- ✅ Swagger documentation complete with @ApiOperation, @ApiBody, @ApiResponse decorators

### Change Log

- 2026-01-30: Story 2.2 implementation completed. All acceptance criteria validated.
- 2026-01-30: JWT authentication implemented with httpOnly cookies for secure token storage
- 2026-01-30: Access token (15min) and refresh token (7 days) generation working correctly
- 2026-01-30: All security requirements met: bcrypt password comparison, XSS protection via httpOnly, CSRF protection via sameSite=strict

### File List

**Modified:**
- apps/backend/.env (added JWT_SECRET, JWT_ACCESS_EXPIRATION, JWT_REFRESH_EXPIRATION, NODE_ENV)
- apps/backend/.env.example (added JWT configuration examples)
- apps/backend/src/modules/auth/auth.module.ts (imported JwtModule, PassportModule with async configuration)
- apps/backend/src/modules/auth/auth.service.ts (added login method, injected JwtService, implemented JWT token generation)
- apps/backend/src/modules/auth/auth.service.spec.ts (added 6 login unit tests)
- apps/backend/src/modules/auth/auth.controller.ts (added login endpoint with httpOnly cookie handling, Swagger decorators)
- apps/backend/test/auth.e2e-spec.ts (added 10 login E2E tests)

**Created:**
- apps/backend/src/modules/auth/dto/login.dto.ts (login DTO with email/password validation + Swagger docs)
- apps/backend/src/modules/auth/dto/index.ts (barrel export for RegisterDto and LoginDto)

**No Changes:**
- apps/backend/src/main.ts (global ValidationPipe already configured)
- apps/backend/src/app.module.ts (AuthModule already imported)
