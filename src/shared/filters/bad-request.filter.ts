/* eslint-disable */
import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { GraphQLError } from 'graphql';

@Catch(HttpException)
export class BadRequestFilter extends BaseExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.getType<string>();

    if (ctx === 'graphql') {
      // Handle GraphQL errors properly
      throw new GraphQLError(exception.message);
    }

    const httpCtx = host.switchToHttp();
    const response = httpCtx.getResponse();
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
