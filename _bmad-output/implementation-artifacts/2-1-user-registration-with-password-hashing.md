# Story 2.1: User Registration with Password Hashing

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to create an account with email and password,
so that I can securely access my property management data.

## Acceptance Criteria

**AC1: Email and Password Validation**

**Given** the backend has the User model in Prisma schema
**When** I create a POST endpoint `/api/v1/auth/register` accepting `{email, password}`
**Then** the endpoint validates email format and password strength (min 8 chars, 1 uppercase, 1 number)
**And** returns 400 with error details if validation fails

**AC2: Password Hashing with bcrypt**

**Given** valid registration data is submitted
**When** the password is hashed using bcrypt with salt rounds = 10
**Then** only the hash is stored in the database (never plain text)
**And** the original password is never logged or exposed

**AC3: Duplicate Email Prevention**

**Given** a user tries to register with an existing email
**When** the registration endpoint is called
**Then** it returns 409 Conflict with message "Email already exists"
**And** no duplicate user is created

**AC4: Successful Registration Response**

**Given** registration is successful
**When** a new user is created
**Then** the response returns 201 Created with `{id, email, createdAt}` (no password)
**And** the user record is stored in the database
**And** the operation is logged (without sensitive data)

## Tasks / Subtasks

- [x] Task 1: Update Prisma Schema with User Model (AC: 1, 2, 4)
  - [x] Subtask 1.1: Add User model to `prisma/schema.prisma` with fields: id (UUID), email (unique), passwordHash, createdAt
  - [x] Subtask 1.2: Run `npx prisma migrate dev --name add-user-model` to create migration
  - [x] Subtask 1.3: Run `npx prisma generate` to update Prisma Client types
  - [x] Subtask 1.4: Verify migration file exists in `prisma/migrations/`
  - [x] Subtask 1.5: Verify database updated correctly with User table

- [x] Task 2: Install Authentication Dependencies (AC: 1, 2)
  - [x] Subtask 2.1: Run `npm install bcrypt class-validator class-transformer` in backend/
  - [x] Subtask 2.2: Run `npm install -D @types/bcrypt` for TypeScript types
  - [x] Subtask 2.3: Verify all dependencies added to package.json
  - [x] Subtask 2.4: Run `npm install` to ensure clean install

- [x] Task 3: Create Auth Module Structure (AC: 1, 2, 3, 4)
  - [x] Subtask 3.1: Generate auth module: `nest g module auth`
  - [x] Subtask 3.2: Generate auth service: `nest g service auth`
  - [x] Subtask 3.3: Generate auth controller: `nest g controller auth`
  - [x] Subtask 3.4: Verify files created in `src/modules/auth/` (if using modular structure)
  - [x] Subtask 3.5: Import PrismaModule into AuthModule

- [x] Task 4: Create Registration DTO with Validation (AC: 1)
  - [x] Subtask 4.1: Create `src/modules/auth/dto/register.dto.ts`
  - [x] Subtask 4.2: Add email field with `@IsEmail()` decorator
  - [x] Subtask 4.3: Add password field with `@IsString()`, `@MinLength(8)`, and `@Matches()` for 1 uppercase + 1 number
  - [x] Subtask 4.4: Add error messages for each validation rule
  - [x] Subtask 4.5: Export RegisterDto from dto/index.ts for clean imports

- [x] Task 5: Implement Registration Logic in AuthService (AC: 2, 3, 4)
  - [x] Subtask 5.1: Inject PrismaService into AuthService constructor
  - [x] Subtask 5.2: Create `register(registerDto: RegisterDto)` method
  - [x] Subtask 5.3: Check if email already exists using `prisma.user.findUnique()`
  - [x] Subtask 5.4: Throw ConflictException (409) if email exists
  - [x] Subtask 5.5: Hash password with `bcrypt.hash(password, 10)` salt rounds
  - [x] Subtask 5.6: Create user with `prisma.user.create()` storing only passwordHash
  - [x] Subtask 5.7: Return user object excluding passwordHash using Prisma `select`
  - [x] Subtask 5.8: Add try-catch for database errors

- [x] Task 6: Create Registration Endpoint in AuthController (AC: 1, 4)
  - [x] Subtask 6.1: Create POST `/auth/register` endpoint with `@Post('register')`
  - [x] Subtask 6.2: Add `@Body()` decorator with RegisterDto type
  - [x] Subtask 6.3: Call `authService.register(registerDto)`
  - [x] Subtask 6.4: Return 201 Created with `@HttpCode(201)`
  - [x] Subtask 6.5: Add API versioning prefix `/api/v1` in main.ts if not already present

- [x] Task 7: Enable Global Validation Pipe (AC: 1)
  - [x] Subtask 7.1: Import ValidationPipe in `src/main.ts`
  - [x] Subtask 7.2: Add `app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))`
  - [x] Subtask 7.3: Verify validation errors return 400 with detailed messages
  - [x] Subtask 7.4: Test with invalid email and weak password

- [x] Task 8: Import AuthModule into AppModule (AC: All)
  - [x] Subtask 8.1: Open `src/app.module.ts`
  - [x] Subtask 8.2: Add AuthModule to imports array
  - [x] Subtask 8.3: Verify app starts without errors
  - [x] Subtask 8.4: Verify `/api/v1/auth/register` endpoint is accessible

- [x] Task 9: Write Unit Tests for AuthService (AC: 2, 3, 4)
  - [x] Subtask 9.1: Create `src/modules/auth/auth.service.spec.ts`
  - [x] Subtask 9.2: Test successful registration returns user without password
  - [x] Subtask 9.3: Test duplicate email throws ConflictException
  - [x] Subtask 9.4: Test password is hashed (verify bcrypt.hash is called)
  - [x] Subtask 9.5: Run `npm test` and verify all tests pass

- [x] Task 10: Write E2E Tests for Registration Endpoint (AC: 1, 3, 4)
  - [x] Subtask 10.1: Create `test/auth.e2e-spec.ts`
  - [x] Subtask 10.2: Test POST /auth/register with valid data returns 201
  - [x] Subtask 10.3: Test POST /auth/register with invalid email returns 400
  - [x] Subtask 10.4: Test POST /auth/register with weak password returns 400
  - [x] Subtask 10.5: Test POST /auth/register with duplicate email returns 409
  - [x] Subtask 10.6: Run `npm run test:e2e` and verify all tests pass

## Dev Notes

### Architecture Compliance Requirements (CRITICAL)

**ARCH-011: Authentication with JWT and bcrypt**
- Password hashing: bcrypt with 10 salt rounds (industry standard)
- Dependencies: `bcrypt`, `@types/bcrypt`, `class-validator`, `class-transformer`
- User model: id (UUID), email (unique), passwordHash, createdAt
- Never store plain text passwords
- Never log or expose passwords in responses
- Architecture ready for multi-user with user isolation

**ARCH-010: Validation**
- Backend: class-validator + class-transformer via ValidationPipe
- Apply globally in main.ts for all endpoints
- DTO-based validation with decorators (@IsEmail, @MinLength, @Matches)
- Whitelist: true (strip non-whitelisted properties)
- ForbidNonWhitelisted: true (reject requests with extra properties)

**ARCH-023: Backend Naming Patterns**
- Files: kebab-case (register.dto.ts, auth.service.ts, auth.controller.ts)
- Classes: PascalCase (RegisterDto, AuthService, AuthController)
- Methods: camelCase (register, findUserByEmail)
- Endpoints: kebab-case (/auth/register)

**ARCH-026: API Response Format**
- Success: Return data directly (no wrapper like {data: ...})
- Errors: {statusCode, message, errors[], timestamp, path} via Exception Filters
- Dates: ISO 8601 format (DateTime Prisma → ISO string)
- Never include sensitive data (passwords, tokens in plain text)

**ARCH-016: Error Handling**
- Use NestJS built-in exceptions (ConflictException, BadRequestException)
- Global Exception Filter already configured in Story 1.4
- Standardized error responses with HTTP status codes
- User-friendly error messages

### Previous Story Intelligence

**Story 1.1 - Project Initialization:**
- Frontend: React + Vite on port 5173
- Backend: NestJS on port 3000
- Jest pre-configured for unit + e2e tests
- TypeScript strict mode enabled
- Dev servers with hot reload working

**Story 1.2 - Prisma ORM Setup:**
- Prisma 5.22.0 installed and configured with SQLite
- Database file: `../../yoyimmo-data/database/yoyimmo.db`
- PrismaService available as injectable provider
- PrismaModule already exists and can be imported
- Migration workflow: `npx prisma migrate dev`
- Generate client: `npx prisma generate`

**Story 1.3 - Docker Compose:**
- External volume: `./yoyimmo-data` mounted at `/app/data`
- Backend accessible on port 3000
- Frontend accessible on port 8080 (production)
- Dev environment uses local ports (3000, 5173)

**Story 1.4 - Core Infrastructure:**
- Global Exception Filter configured
- Winston logging framework integrated
- API documentation with Swagger on `/api/docs`
- Standardized error responses

**Key Patterns from Previous Stories:**
- Modular structure: `/src/modules/{domain}/`
- Tests co-located with `.spec.ts` suffix
- E2E tests in `/test` directory with `.e2e-spec.ts` suffix
- Import PrismaModule into feature modules
- Use dependency injection for services
- DTO-based request validation

### File Structure for This Story

```
apps/backend/
├── prisma/
│   ├── schema.prisma                      # ADD User model
│   └── migrations/
│       └── YYYYMMDDHHMMSS_add-user-model/ # GENERATED
├── src/
│   ├── main.ts                            # UPDATE: Add global ValidationPipe
│   ├── app.module.ts                      # UPDATE: Import AuthModule
│   └── modules/
│       └── auth/                          # NEW MODULE
│           ├── auth.module.ts             # GENERATED by nest CLI
│           ├── auth.service.ts            # GENERATED + implement register()
│           ├── auth.service.spec.ts       # CREATE unit tests
│           ├── auth.controller.ts         # GENERATED + add register endpoint
│           └── dto/
│               ├── register.dto.ts        # CREATE with validation
│               └── index.ts               # CREATE for clean exports
└── test/
    └── auth.e2e-spec.ts                   # CREATE e2e tests
```

### Technical Implementation Details

**User Prisma Model:**
```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())

  // Relations will be added in future stories
  @@map("users")
}
```

**RegisterDto Validation:**
```typescript
import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least 1 uppercase letter and 1 number',
  })
  password: string;
}
```

**AuthService register() method:**
```typescript
import * as bcrypt from 'bcrypt';
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(private readonly prisma: PrismaService) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    // Check if email already exists
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

    return user;
  }
}
```

**AuthController register endpoint:**
```typescript
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
```

**Global ValidationPipe in main.ts:**
```typescript
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API versioning
  app.setGlobalPrefix('api/v1');

  await app.listen(3000);
}
```

### Security Considerations

**Password Hashing Best Practices:**
- Use bcrypt with 10 salt rounds (balances security and performance)
- Never store plain text passwords
- Never log passwords (even in debug mode)
- Never return passwords in API responses

**Validation Security:**
- Email validation prevents injection attacks
- Password strength requirements enforce minimum security
- Whitelist mode strips unexpected properties
- ForbidNonWhitelisted rejects malicious extra fields

**Error Messages:**
- Generic "Email already exists" (don't reveal if email is registered)
- Don't expose stack traces in production
- Log detailed errors server-side only

### Testing Requirements

**Unit Tests (auth.service.spec.ts):**
- Test successful registration creates user with hashed password
- Test duplicate email throws ConflictException
- Test bcrypt.hash is called with correct salt rounds
- Test returned user excludes passwordHash
- Mock PrismaService for isolation

**E2E Tests (auth.e2e-spec.ts):**
- Test POST /api/v1/auth/register with valid data returns 201
- Test response includes {id, email, createdAt} without password
- Test invalid email format returns 400 with validation errors
- Test password < 8 chars returns 400
- Test password without uppercase returns 400
- Test password without number returns 400
- Test duplicate email returns 409
- Verify user is actually created in database

**Test Coverage Target:**
- AuthService: > 80% coverage (all branches)
- AuthController: > 70% coverage
- Integration: All acceptance criteria validated

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 2: User Authentication & Data Security]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.1: User Registration with Password Hashing]
- [Source: _bmad-output/planning-artifacts/architecture.md#ADR-004: Authentification - JWT avec httpOnly Cookies]
- [Source: _bmad-output/planning-artifacts/architecture.md#ARCH-011: Authentication]
- [Source: _bmad-output/planning-artifacts/architecture.md#ARCH-010: Validation]
- [Source: _bmad-output/planning-artifacts/prd.md#Non-Functional Requirements - NFR5: Sécurité]
- [Source: _bmad-output/implementation-artifacts/1-2-prisma-orm-setup-with-sqlite.md - Prisma configuration and patterns]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Fixed API route conflict: Controller had `@Controller('api/v1/auth')` but main.ts had `app.setGlobalPrefix('api')` causing double prefix `/api/api/v1/auth`. Changed controller to `@Controller('v1/auth')`.
- Removed local `@UsePipes(ValidationPipe)` decorator in favor of global ValidationPipe in main.ts.
- Added PrismaModule import to AuthModule (was missing, causing dependency injection failure).

### Completion Notes List

- ✅ All 10 tasks completed with all subtasks
- ✅ User model already existed in Prisma schema from Epic 1 (Story 1.2)
- ✅ Dependencies (bcrypt, class-validator, class-transformer) already installed
- ✅ AuthModule created with proper structure in `src/modules/auth/`
- ✅ RegisterDto implements validation: @IsEmail, @MinLength(8), @Matches for uppercase+number
- ✅ AuthService.register() hashes password with bcrypt (10 salt rounds), checks duplicate email
- ✅ AuthController exposes POST /api/v1/auth/register endpoint with 201 Created response
- ✅ Global ValidationPipe configured with whitelist, forbidNonWhitelisted, transform options
- ✅ AuthModule imported in AppModule
- ✅ Unit tests: 6 tests passing (auth.service.spec.ts)
- ✅ E2E tests: 10 tests passing (auth.e2e-spec.ts)
- ✅ All existing tests still pass (no regressions)
- ✅ Build succeeds without errors

### Change Log

- 2026-01-29: Story 2.1 implementation completed. All acceptance criteria validated.
- 2026-01-29: Code review fixes applied:
  - Added try-catch error logging in AuthService.register() for unexpected failures
  - Removed redundant @HttpCode decorator from AuthController (POST defaults to 201)
  - All tests still passing (10 unit + 17 e2e)

### File List

**Modified:**
- apps/backend/src/main.ts (added global ValidationPipe)
- apps/backend/src/app.module.ts (imported AuthModule)
- apps/backend/src/modules/auth/auth.module.ts (imported PrismaModule)
- apps/backend/src/modules/auth/auth.controller.ts (fixed route prefix to v1/auth, removed redundant @HttpCode)
- apps/backend/src/modules/auth/auth.service.ts (added try-catch error logging)

**Created:**
- apps/backend/src/modules/auth/auth.service.spec.ts (unit tests)
- apps/backend/test/auth.e2e-spec.ts (e2e tests)

**Already Existed (from previous session):**
- apps/backend/prisma/schema.prisma (User model)
- apps/backend/src/modules/auth/auth.module.ts
- apps/backend/src/modules/auth/auth.service.ts
- apps/backend/src/modules/auth/auth.controller.ts
- apps/backend/src/modules/auth/dto/register.dto.ts
