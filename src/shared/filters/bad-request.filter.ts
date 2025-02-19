import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(HttpException)
export class BadRequestFilter extends BaseExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any)?.message || 'Bad Request';

    if (status === HttpStatus.BAD_REQUEST) {
      response.status(status).json({
        statusCode: status,
        message,
      });
    } else {
      super.catch(exception, host);
    }
  }
}
