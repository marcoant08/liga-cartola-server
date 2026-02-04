import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

export interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | string[];
  error?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string | string[];
    let error: string | undefined;

    if (exception instanceof HttpException) {
      // Exceções HTTP do NestJS
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;
        error = responseObj.error;
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      // Erros genéricos do JavaScript
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = process.env.NODE_ENV === 'production' 
        ? 'Erro interno do servidor' 
        : exception.message;
      error = 'Internal Server Error';
      
      // Log do erro completo em desenvolvimento
      this.logger.error(
        `Unhandled exception: ${exception.message}`,
        exception.stack,
        HttpExceptionFilter.name,
      );
    } else {
      // Erros desconhecidos
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Erro interno do servidor';
      error = 'Internal Server Error';
      
      this.logger.error(
        `Unknown exception: ${JSON.stringify(exception)}`,
        HttpExceptionFilter.name,
      );
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      ...(error && { error }),
    };

    // Log da requisição que causou o erro
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${JSON.stringify(message)}`,
      HttpExceptionFilter.name,
    );

    response.status(status).json(errorResponse);
  }
}
