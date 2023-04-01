import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
  NotAcceptableException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Request, Response } from 'express';

@Catch(
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  NotAcceptableException,
  ForbiddenException,
  ThrottlerException,
  ConflictException,
)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    switch (status) {
      case HttpStatus.INTERNAL_SERVER_ERROR:
        response.status(status).json({
          statusCode: status,
          message: ['Internal server error', request.url],
          error: 'Server Error',
        });
        break;
      case HttpStatus.NOT_FOUND:
        response.status(status).json({
          statusCode: status,
          message: ['Resource not found', request.url],
          error: 'Not found',
        });
        break;
      case HttpStatus.UNAUTHORIZED:
        response.status(status).json({
          statusCode: status,
          message: ['Resource Unauthorized', request.url],
          error: 'Unauthorized',
        });
        break;
      case HttpStatus.NOT_ACCEPTABLE:
        response.status(status).json({
          statusCode: status,
          message: ['Validation failed, please verify the correct type of params', request.url],
          error: 'Not Acceptable',
        });
        break;
      case HttpStatus.FORBIDDEN:
        response.status(status).json({
          statusCode: status,
          message: ['Forbidden resource', request.url],
          error: 'Forbidden',
        });
        break;
      case HttpStatus.CONFLICT:
        response.status(status).json({
          statusCode: status,
          message: ['Forbidden resource', request.url],
          error: 'Conflict',
        });
        break;
      case HttpStatus.TOO_MANY_REQUESTS:
        response.status(status).json({
          statusCode: status,
          message: ['Too Many Requests', request.url],
          error: 'ThrottlerException',
        });
        break;
    }
  }
}
