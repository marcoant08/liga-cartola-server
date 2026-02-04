import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

export interface ValidationErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string[];
  error: string;
}

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const exceptionResponse = exception.getResponse();
    let messages: string[] = [];

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as any;
      
      // Se for um array de mensagens de validação
      if (Array.isArray(responseObj.message)) {
        messages = responseObj.message;
      } else if (typeof responseObj.message === 'string') {
        messages = [responseObj.message];
      } else {
        messages = [exception.message];
      }
    } else {
      messages = [exception.message];
    }

    const errorResponse: ValidationErrorResponse = {
      statusCode: 400,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: messages,
      error: 'Bad Request',
    };

    this.logger.warn(
      `Validation failed: ${request.method} ${request.url} - ${JSON.stringify(messages)}`,
      ValidationExceptionFilter.name,
    );

    response.status(400).json(errorResponse);
  }
}
