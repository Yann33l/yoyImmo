# Story 1.4: Core Infrastructure Setup (Logging, Error Handling, API Docs)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to configure logging, error handling, and API documentation,
So that the application has proper observability and developer experience.

## Acceptance Criteria

**AC1: Winston Logging Configuration**

**Given** the NestJS backend is running
**When** I install and configure Winston via `nest-winston`
**Then** structured JSON logs are written to console
**And** error logs are written to `/app/data/logs/error.log`
**And** combined logs are written to `/app/data/logs/combined.log`
**And** log entries include timestamp, level, message, and context

**AC2: Global Exception Filter**

**Given** Winston is configured
**When** an unhandled exception occurs in a controller
**Then** a global Exception Filter catches it
**And** returns a standardized error response: `{statusCode, message, errors[], timestamp, path}`
**And** the error is logged with full stack trace

**AC3: Swagger API Documentation**

**Given** the backend is running
**When** I install and configure `@nestjs/swagger`
**Then** Swagger documentation is accessible at `http://localhost:3000/api/docs`
**And** the API documentation includes title "YoyImmo API", version "1.0", and description
**And** all future endpoints will be auto-documented using decorators

**AC4: Health Check Endpoint**

**Given** core infrastructure is set up
**When** I verify the setup with a test endpoint `/api/v1/health`
**Then** it returns `{status: 'ok', timestamp: ISO8601}` with 200 status
**And** the request/response is logged via Winston
**And** the endpoint appears in Swagger documentation

## Tasks / Subtasks

- [x] Task 1: Install Winston and nest-winston Dependencies (AC: 1)
  - [x] Subtask 1.1: Run `npm install winston nest-winston --workspace=backend`
  - [x] Subtask 1.2: Verify packages added to backend/package.json
  - [x] Subtask 1.3: Create logs directory structure in yoyimmo-data/logs/

- [x] Task 2: Configure Winston Logger Module (AC: 1)
  - [x] Subtask 2.1: Create `src/common/logger/winston.config.ts` with Winston configuration
  - [x] Subtask 2.2: Configure transports: console (JSON format), file (error.log), file (combined.log)
  - [x] Subtask 2.3: Set log levels: error, warn, info, debug
  - [x] Subtask 2.4: Add timestamp, context, and structured format to all logs
  - [x] Subtask 2.5: Import WinstonModule in AppModule with configuration

- [x] Task 3: Create Global Exception Filter (AC: 2)
  - [x] Subtask 3.1: Create `src/common/filters/http-exception.filter.ts`
  - [x] Subtask 3.2: Implement @Catch() decorator for all exceptions
  - [x] Subtask 3.3: Extract error details: statusCode, message, errors[], timestamp, path
  - [x] Subtask 3.4: Log full error with stack trace using Winston
  - [x] Subtask 3.5: Return standardized error response format
  - [x] Subtask 3.6: Register filter globally in main.ts with app.useGlobalFilters()

- [x] Task 4: Configure Swagger API Documentation (AC: 3)
  - [x] Subtask 4.1: Run `npm install @nestjs/swagger --workspace=backend`
  - [x] Subtask 4.2: Import and configure SwaggerModule in main.ts
  - [x] Subtask 4.3: Set document title: "YoyImmo API", version: "1.0", description
  - [x] Subtask 4.4: Mount Swagger UI at `/api/docs`
  - [x] Subtask 4.5: Verify Swagger loads and shows existing /auth/register endpoint

- [x] Task 5: Create Health Check Endpoint (AC: 4)
  - [x] Subtask 5.1: Create `src/modules/health/health.controller.ts`
  - [x] Subtask 5.2: Create GET `/v1/health` endpoint returning {status: 'ok', timestamp}
  - [x] Subtask 5.3: Add @ApiTags('Health') and @ApiResponse decorators for Swagger
  - [x] Subtask 5.4: Inject Winston logger and log health check requests
  - [x] Subtask 5.5: Create HealthModule and import in AppModule

- [x] Task 6: Write Tests for Infrastructure (AC: All)
  - [x] Subtask 6.1: Create unit test for HttpExceptionFilter
  - [x] Subtask 6.2: Create e2e test for /v1/health endpoint
  - [x] Subtask 6.3: Test exception handling with invalid requests
  - [x] Subtask 6.4: Verify logs are written to files
  - [x] Subtask 6.5: Run all tests and verify they pass

## Dev Notes

### Architecture Compliance Requirements (CRITICAL)

**ARCH-015: Logging with Winston**
- Framework: Winston via nest-winston for NestJS integration
- Log Levels: error, warn, info, debug (configurable per environment)
- Transports:
  - Console: JSON format for structured logging
  - File: error.log (error level only)
  - File: combined.log (all levels)
- Log Format: `{timestamp, level, message, context, ...metadata}`
- Log Location: `/app/data/logs/` (Docker volume mounted)
- Never log sensitive data (passwords, tokens, PII)

**ARCH-016: Error Handling**
- Global Exception Filter for all unhandled exceptions
- Standardized error response format:
  ```json
  {
    "statusCode": 400,
    "message": "Human-readable error message",
    "errors": ["Detailed validation errors array"],
    "timestamp": "2026-01-29T12:00:00.000Z",
    "path": "/api/v1/auth/register"
  }
  ```
- NestJS built-in exceptions: BadRequestException, UnauthorizedException, etc.
- Log all errors with full stack trace (server-side only)
- Never expose internal errors or stack traces to clients in production

**ARCH-017: API Documentation with Swagger**
- Framework: @nestjs/swagger
- Mount Point: `/api/docs`
- Auto-generate from decorators: @ApiTags, @ApiOperation, @ApiResponse, @ApiProperty
- Document all endpoints, DTOs, and response schemas
- Include authentication requirements when implemented
- Version: Track API version in Swagger config (1.0)

**ARCH-023: Backend Naming Patterns**
- Files: kebab-case (winston.config.ts, http-exception.filter.ts, health.controller.ts)
- Classes: PascalCase (HttpExceptionFilter, HealthController)
- Methods: camelCase (logError, getHealthStatus)
- Directories: kebab-case (common/filters/, common/logger/, modules/health/)

### Previous Story Intelligence

**Story 1-1: Project Initialization**
- NestJS 10+ with TypeScript 5.x
- Jest pre-configured for unit + e2e tests
- Backend runs on port 3000
- Global API prefix `/api` set in main.ts

**Story 1-2: Prisma ORM Setup**
- PrismaService available for dependency injection
- Database file: `../../yoyimmo-data/database/yoyimmo.db`
- PrismaModule already global

**Story 1-3: Docker Compose**
- Volume mount: `./yoyimmo-data:/app/data`
- Logs should go to `/app/data/logs/` (accessible from host)
- Environment: NODE_ENV=production in Docker

**Story 2-1: User Registration**
- **Key Learnings:**
  - Global ValidationPipe configured in main.ts (whitelist, forbidNonWhitelisted, transform)
  - Controllers use `@Controller('v1/{route}')` pattern (not 'api/v1/{route}')
  - NestJS Logger already used in AuthService for logging
  - Try-catch error handling pattern established
  - Modular structure: `src/modules/{domain}/`
  - Tests: Unit (.spec.ts) + E2E (test/*.e2e-spec.ts)

### File Structure for This Story

```
apps/backend/
├── src/
│   ├── common/
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts        # NEW: Global exception filter
│   │   └── logger/
│   │       └── winston.config.ts                # NEW: Winston configuration
│   ├── modules/
│   │   └── health/
│   │       ├── health.module.ts                 # NEW: Health module
│   │       └── health.controller.ts             # NEW: Health controller
│   ├── main.ts                                   # UPDATE: Add Swagger, register filter
│   └── app.module.ts                             # UPDATE: Import WinstonModule, HealthModule
├── test/
│   └── health.e2e-spec.ts                       # NEW: E2E tests
└── yoyimmo-data/
    └── logs/                                     # CREATE: Log directory
        ├── error.log                             # AUTO-GENERATED
        └── combined.log                          # AUTO-GENERATED
```

### Technical Implementation Details

**Winston Configuration (winston.config.ts):**

```typescript
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as path from 'path';

export const winstonConfig = WinstonModule.createLogger({
  transports: [
    // Console transport (JSON format)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    // Error log file
    new winston.transports.File({
      filename: path.join('../../yoyimmo-data/logs', 'error.log'),
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    // Combined log file
    new winston.transports.File({
      filename: path.join('../../yoyimmo-data/logs', 'combined.log'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
});
```

**Global Exception Filter (http-exception.filter.ts):**

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? exception.getResponse()
      : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      message: typeof message === 'string' ? message : (message as any).message,
      errors: typeof message === 'object' && (message as any).errors ? (message as any).errors : [],
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Log error with stack trace
    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : 'No stack trace',
    );

    response.status(status).json(errorResponse);
  }
}
```

**Health Controller (health.controller.ts):**

```typescript
import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('v1/health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Application is healthy' })
  getHealth() {
    this.logger.log('Health check requested');
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
```

**Swagger Configuration in main.ts:**

```typescript
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ... existing config ...

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('YoyImmo API')
    .setDescription('Property management API for YoyImmo application')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Register global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
```

### Testing Strategy

**Unit Tests:**
- HttpExceptionFilter: Test error formatting, logging, status codes
- Winston config: Test log file creation, format, levels

**E2E Tests (health.e2e-spec.ts):**
- GET /api/v1/health returns 200 with correct payload
- Verify Swagger docs accessible at /api/docs
- Test exception handling with invalid request
- Verify error response format

### Success Criteria Summary

This story is COMPLETE when:
- [ ] Winston installed and configured with console + file transports
- [ ] Logs written to yoyimmo-data/logs/ (error.log, combined.log)
- [ ] Global Exception Filter catches all errors
- [ ] Error responses follow standardized format
- [ ] Swagger docs accessible at http://localhost:3000/api/docs
- [ ] Health endpoint /api/v1/health returns 200 with {status, timestamp}
- [ ] Health endpoint documented in Swagger
- [ ] All tests passing (unit + e2e)
- [ ] Logs include timestamp, level, message, context

### References

- [Source: F:\App\BMAD\_bmad-output\planning-artifacts\epics.md#Epic 1 Story 1.4]
- [Source: F:\App\BMAD\_bmad-output\planning-artifacts\architecture.md#ARCH-015 Logging]
- [Source: F:\App\BMAD\_bmad-output\planning-artifacts\architecture.md#ARCH-016 Error Handling]
- [Source: F:\App\BMAD\_bmad-output\planning-artifacts\architecture.md#ARCH-017 API Documentation]
- [NestJS Winston: https://github.com/gremo/nest-winston]
- [NestJS Swagger: https://docs.nestjs.com/openapi/introduction]
- [Winston Documentation: https://github.com/winstonjs/winston]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (create-story workflow)

### Debug Log References

None

### Completion Notes List

**Story Creation (2026-01-29):**
- Ultimate context engine analysis completed
- All previous story learnings incorporated
- Architecture requirements extracted from ARCH-015, ARCH-016, ARCH-017
- File structure and code examples provided

**Implementation (2026-01-29):**
- ✅ Winston and nest-winston installed for logging
- ✅ @nestjs/swagger installed with --legacy-peer-deps
- ✅ Winston configured with 3 transports (console, error.log, combined.log)
- ✅ Global HttpExceptionFilter with standardized error format
- ✅ Swagger documentation at /api/docs with YoyImmo API v1.0
- ✅ Health endpoint /api/v1/health with Swagger docs
- ✅ All 6 tasks and 30 subtasks completed
- ✅ 35 tests passing initially (15 unit + 20 e2e)

**Code Review & Fixes (2026-01-29):**
- 🔍 Adversarial review found 8 issues (1 HIGH, 3 MEDIUM, 4 LOW)
- ✅ HIGH-1: Fixed HttpExceptionFilter to use Winston logger (not NestJS Logger)
- ✅ MEDIUM-1: Added test verifying logs written to error.log file
- ✅ MEDIUM-2: Added log rotation (maxsize: 5MB, maxFiles: 5)
- ✅ MEDIUM-3: Fixed hardcoded path with env var support (LOG_DIR)
- ✅ Updated tests to inject Winston properly
- ✅ 37 tests passing (16 unit + 21 e2e) - +2 new tests
- ✅ No regressions

### File List

**Created:**
- apps/backend/src/common/filters/http-exception.filter.ts
- apps/backend/src/common/filters/http-exception.filter.spec.ts
- apps/backend/src/common/logger/winston.config.ts
- apps/backend/src/modules/health/health.module.ts
- apps/backend/src/modules/health/health.controller.ts
- apps/backend/test/health.e2e-spec.ts
- yoyimmo-data/logs/

**Modified:**
- apps/backend/src/main.ts
- apps/backend/src/app.module.ts
- apps/backend/package.json
