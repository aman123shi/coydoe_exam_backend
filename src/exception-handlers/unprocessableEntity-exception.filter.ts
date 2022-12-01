import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(UnprocessableEntityException)
export class UnprocessableEntityExceptionFilter implements ExceptionFilter {
  catch(exception: UnprocessableEntityException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const name = exception.name;
    const message = exception.message;
    console.log('my own exception filter called');

    return response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: message,
      name: name,
      path: request.url,
    });
  }
}
