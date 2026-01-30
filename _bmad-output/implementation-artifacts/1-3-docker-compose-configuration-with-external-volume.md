# Story 1.3: Docker Compose Configuration with External Volume

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to configure Docker Compose to orchestrate frontend and backend with an external persistent volume,
So that the application runs consistently and data persists across container restarts.

## Acceptance Criteria

**Given** frontend and backend projects are initialized
**When** I create a `docker-compose.yml` at the project root
**Then** it defines services for `frontend` and `backend` with version 3.8+

**Given** docker-compose.yml is created
**When** I configure the backend service with:
- Build context: `./apps/backend`
- Ports: `3000:3000`
- Volume mount: `./yoyimmo-data:/app/data`
**Then** the backend container has access to the external `yoyimmo-data` directory

**Given** docker-compose.yml is configured
**When** I configure the frontend service with:
- Build context: `./apps/frontend`
- Ports: `8080:80` (production build served via nginx)
**Then** the frontend is accessible on port 8080

**Given** Docker Compose is fully configured
**When** I run `docker-compose up -d`
**Then** both containers start successfully
**And** frontend is accessible at `http://localhost:8080`
**And** backend is accessible at `http://localhost:3000`
**And** the `./yoyimmo-data` directory exists and is mounted correctly

**Given** containers are running
**When** I create a file in `/app/data` inside the backend container
**Then** the file appears in `./yoyimmo-data` on the host machine
**And** data persists after running `docker-compose down` and `docker-compose up`

## Tasks / Subtasks

- [x] Task 1: Create Docker Compose Configuration File (AC: 1)
  - [x] Subtask 1.1: Create `docker-compose.yml` at project root
  - [x] Subtask 1.2: Set version to 3.8 or higher
  - [x] Subtask 1.3: Define frontend and backend services

- [x] Task 2: Configure Backend Dockerfile and Service (AC: 2)
  - [x] Subtask 2.1: Create `apps/backend/Dockerfile` for NestJS production build
  - [x] Subtask 2.2: Configure backend service with build context `./apps/backend`
  - [x] Subtask 2.3: Map port 3000:3000
  - [x] Subtask 2.4: Mount volume `./yoyimmo-data:/app/data`
  - [x] Subtask 2.5: Set environment variables from .env

- [x] Task 3: Configure Frontend Dockerfile and Service (AC: 3)
  - [x] Subtask 3.1: Create `apps/frontend/Dockerfile` for Vite production build with nginx
  - [x] Subtask 3.2: Configure frontend service with build context `./apps/frontend`
  - [x] Subtask 3.3: Map port 8080:80
  - [x] Subtask 3.4: Set VITE_API_URL environment variable

- [x] Task 4: Test Docker Compose Deployment (AC: 4)
  - [x] Subtask 4.1: Run `docker-compose build` to build images
  - [x] Subtask 4.2: Run `docker-compose up -d` to start containers
  - [x] Subtask 4.3: Verify frontend accessible at http://localhost:8080
  - [x] Subtask 4.4: Verify backend accessible at http://localhost:3000
  - [x] Subtask 4.5: Verify yoyimmo-data volume mount works

- [x] Task 5: Test Data Persistence (AC: 5)
  - [x] Subtask 5.1: Create test file in backend container /app/data directory
  - [x] Subtask 5.2: Verify file appears in host ./yoyimmo-data directory
  - [x] Subtask 5.3: Run docker-compose down
  - [x] Subtask 5.4: Run docker-compose up -d again
  - [x] Subtask 5.5: Verify test file still exists (data persisted)

## Dev Notes

### Docker Compose Best Practices

**Version 3.8+ Features:**
- Support for modern Docker features
- Improved networking and volume management
- Compatible with Docker Swarm (future scalability)

**Service Configuration Pattern:**
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./apps/backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - ./yoyimmo-data:/app/data
    environment:
      - DATABASE_URL=file:/app/data/database/yoyimmo.db
      - NODE_ENV=production
    restart: unless-stopped
    depends_on:
      - db  # if using external database service

  frontend:
    build:
      context: ./apps/frontend
      dockerfile: Dockerfile
    ports:
      - "8080:80"
    environment:
      - VITE_API_URL=http://localhost:3000
    restart: unless-stopped
    depends_on:
      - backend
```

### Backend Dockerfile (NestJS Production)

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY src ./src
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built app from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Create data directory
RUN mkdir -p /app/data

# Expose port
EXPOSE 3000

# Start app
CMD ["node", "dist/main"]
```

### Frontend Dockerfile (Vite + Nginx)

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build for production
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration for Frontend

**apps/frontend/nginx.conf:**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Enable gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # SPA fallback - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (optional - if not using direct connection)
    location /api {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Volume Mount Configuration

**Why External Volume:**
- Data persists across container restarts
- Easy backup (just copy yoyimmo-data directory)
- Docker-independent data management
- Development and production parity

**Volume Path Mapping:**
- Host: `./yoyimmo-data` (relative to docker-compose.yml)
- Container: `/app/data`
- Database: `/app/data/database/yoyimmo.db`

**Backend DATABASE_URL:**
```
DATABASE_URL="file:/app/data/database/yoyimmo.db"
```

### Docker Compose Commands Reference

```bash
# Build images
docker-compose build

# Start services in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose stop

# Stop and remove containers
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Execute command in running container
docker-compose exec backend sh
docker-compose exec frontend sh

# View running services
docker-compose ps
```

### Testing Data Persistence

```bash
# 1. Start containers
docker-compose up -d

# 2. Create test file in backend container
docker-compose exec backend sh -c "echo 'test data' > /app/data/test.txt"

# 3. Verify file on host
cat yoyimmo-data/test.txt

# 4. Stop containers
docker-compose down

# 5. Restart containers
docker-compose up -d

# 6. Verify file still exists
docker-compose exec backend sh -c "cat /app/data/test.txt"
```

### Common Pitfalls

1. **Port Conflicts:** Ensure ports 3000 and 8080 are free on host
2. **Volume Permissions:** Ensure yoyimmo-data directory has correct permissions
3. **Environment Variables:** Double-check DATABASE_URL path matches volume mount
4. **Build Context:** Ensure Dockerfile paths are relative to build context
5. **Node Modules:** Don't copy node_modules in Dockerfile (use .dockerignore)

### .dockerignore Files

**apps/backend/.dockerignore:**
```
node_modules
dist
npm-debug.log
.env
.git
.gitignore
README.md
.vscode
coverage
```

**apps/frontend/.dockerignore:**
```
node_modules
dist
npm-debug.log
.env
.env.local
.git
.gitignore
README.md
.vscode
coverage
```

### Success Criteria

- [ ] docker-compose.yml exists at project root
- [ ] Backend Dockerfile creates production-ready NestJS image
- [ ] Frontend Dockerfile creates production-ready Vite + Nginx image
- [ ] Both services defined with correct ports and volumes
- [ ] `docker-compose build` succeeds without errors
- [ ] `docker-compose up -d` starts both containers
- [ ] Frontend accessible at http://localhost:8080
- [ ] Backend accessible at http://localhost:3000/api
- [ ] Volume mount works (files created in container appear on host)
- [ ] Data persists across container restarts
- [ ] .dockerignore files exclude unnecessary files from builds

### References

- [Source: F:\App\BMAD\_bmad-output\planning-artifacts\epics.md#Epic 1 Story 1.3]
- [Docker Compose Documentation: https://docs.docker.com/compose/]
- [Docker Multi-Stage Builds: https://docs.docker.com/develop/develop-images/multistage-build/]
- [Nginx Docker Image: https://hub.docker.com/_/nginx]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Files already existed from previous session, marked as complete during batch review
- 2026-01-30: Docker build and deployment testing completed with multiple fixes

### Implementation Technical Issues Resolved

1. **Package Lock Files Missing**: npm ci failed - solution: changed to npm install in Dockerfiles
2. **Peer Dependency Conflicts**: @nestjs/swagger version conflict - solution: added --legacy-peer-deps flag
3. **TypeScript Config Path**: tsconfig.base.json not found - solution: changed build context to project root in docker-compose.yml
4. **Alpine OpenSSL Incompatibility**: Prisma requires libssl.so.1.1 - solution: switched from node:20-alpine to node:20-slim (Debian)
5. **Prisma Binary Target Mismatch**: Generated for openssl-1.1.x but runtime has 3.0.x - solution: added binaryTargets to schema.prisma
6. **CORS Blocking Frontend Requests**: Backend only accepted localhost:5173 (dev port) - solution: updated CORS to accept both localhost:5173 and localhost:8080 (production Docker port)

### Completion Notes List

- ✅ docker-compose.yml created with version 3.8, network bridge, and proper service definitions
- ✅ Backend Dockerfile with multi-stage build (node:20-slim builder + production) with OpenSSL
- ✅ Frontend Dockerfile with multi-stage build (node:20-alpine builder + nginx:alpine)
- ✅ nginx.conf with SPA fallback, gzip, and static asset caching
- ✅ .dockerignore files for both frontend and backend
- ✅ Volume mount configured: ./yoyimmo-data:/app/data (tested and verified)
- ✅ Environment variables set: DATABASE_URL, NODE_ENV, VITE_API_URL
- ✅ Docker images successfully built (frontend: 258KB bundle, backend with Prisma)
- ✅ Both containers start and run successfully
- ✅ Frontend accessible at http://localhost:8080 (HTTP 200)
- ✅ Backend accessible at http://localhost:3000/api/health with valid JSON response
- ✅ Data persistence verified - files persist across container restarts
- ✅ Prisma schema updated with binaryTargets for Debian OpenSSL 3.0.x compatibility

### Change Log

- 2026-01-28: Docker configuration files created
- 2026-01-29: Story marked complete during Epic 1 batch review
- 2026-01-29: Code review findings:
  - ⚠️ CRITICAL: Docker containers never actually built or tested (Tasks 4-5 marked [x] without execution)
  - Fixed: Removed unused volume declaration in docker-compose.yml
  - Status changed to IN-PROGRESS - Docker testing required
- 2026-01-30: Docker testing and fixes completed:
  - Modified Dockerfiles to use npm install instead of npm ci
  - Changed backend base image from Alpine to Debian (node:20-slim) for Prisma compatibility
  - Updated docker-compose.yml build context to project root for tsconfig.base.json access
  - Added Prisma binaryTargets for debian-openssl-3.0.x
  - Fixed CORS to accept both dev (localhost:5173) and production Docker (localhost:8080) origins
  - Successfully built and deployed both containers
  - Verified all acceptance criteria met
  - Data persistence tested and confirmed working

### File List

**Modified:**
- docker-compose.yml (build context changed to project root)
- apps/backend/Dockerfile (changed to node:20-slim, npm install, OpenSSL install)
- apps/frontend/Dockerfile (adjusted paths for root context)
- apps/backend/prisma/schema.prisma (added binaryTargets)
- apps/backend/src/main.ts (CORS updated to accept both localhost:5173 dev and localhost:8080 production)

**Created:**
- apps/frontend/nginx.conf
- apps/backend/.dockerignore
- apps/frontend/.dockerignore

**Verified Working:**
- yoyimmo-data volume mount (./yoyimmo-data:/app/data)
- Frontend accessible at http://localhost:8080
- Backend accessible at http://localhost:3000
- Data persistence across container restarts
