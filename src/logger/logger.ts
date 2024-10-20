import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    response.on('close', () => {
      const { statusCode } = response;

      this.logger.log(
        `${request.method} ${request.url} ${statusCode} ` +
          `${JSON.stringify(request.params)} ${JSON.stringify(request.body)}`,
      );
    });

    next();
  }
}
