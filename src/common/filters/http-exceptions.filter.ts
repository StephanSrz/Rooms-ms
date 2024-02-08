import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {

  private readonly logger = new Logger();

  catch(exception: HttpException, host: ArgumentsHost){
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus ? exception.getStatus() : 500;
    const msg = exception instanceof HttpException
      ? exception.getResponse()
      : exception;

    this.logger.error(`Status ${status}. Error ${msg}`);

    response
      .status(status)
      .json({
        statusCode: status,
        timeStamp: new Date().toISOString(),
        path: request.url,
        error: msg.toString()
      });
  }
}