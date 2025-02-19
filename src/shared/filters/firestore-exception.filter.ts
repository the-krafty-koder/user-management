import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { FirebaseAuthError } from 'firebase-admin/auth';

@Catch(FirebaseAuthError)
export class FirestoreExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof FirebaseAuthError) {
      const statusCode =
        exception.code === 'auth/email-already-exists'
          ? HttpStatus.BAD_REQUEST
          : HttpStatus.INTERNAL_SERVER_ERROR;

      response.status(statusCode).json({
        statusCode,
        message: exception.message || 'Firestore error',
        error: exception.code || 'Firestore Error',
      });
    } else {
      super.catch(exception, host);
    }
  }
}
