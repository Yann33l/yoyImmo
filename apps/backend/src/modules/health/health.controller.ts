import { Controller, Get, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller(['v1/health', 'health'])
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
