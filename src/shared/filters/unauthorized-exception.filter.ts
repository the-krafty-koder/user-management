/* eslint-disable */

import { Catch, ArgumentsHost, UnauthorizedException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter extends BaseExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(401).json({
      statusCode: 401,
      message: exception.message || 'Unauthorized',
    });
  }
}
