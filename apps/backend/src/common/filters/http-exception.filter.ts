import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      message:
        typeof message === 'string' ? message : (message as any).message,
      errors:
        typeof message === 'object' && (message as any).errors
          ? (message as any).errors
          : [],
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Log error with stack trace using Winston
    this.logger.error({
      message: `${request.method} ${request.url}`,
      statusCode: status,
      stack: exception instanceof Error ? exception.stack : 'No stack trace',
      path: request.url,
    });

    response.status(status).json(errorResponse);
  }
}
