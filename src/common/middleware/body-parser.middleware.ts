import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as express from 'express';

@Injectable()
export class BodyParserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    /**
     * Middleware function to parse the request body and add custom headers.
     *
     * This function extracts the 'platform' and 'accept-language' headers from the request,
     * assigns default values if they are not present, and attaches them to the request object.
     * It then uses the express.json() and express.urlencoded() middlewares to parse the request body.
     *
     * @param {Request} req - The incoming request object.
     * @param {Response} res - The outgoing response object.
     * @param {NextFunction} next - The next middleware function in the stack.
     */

    const platform = req.headers['platform'] || 'unknown';
    const language = req.headers['accept-language'] || 'en';

    (req as any).platform = platform;
    (req as any).language = language;
    express.json({ limit: '10mb' })(req, res, (err) => {
      if (err) {
        next(err);
      } else {
        express.urlencoded({
          limit: '10mb',
          extended: true,
          parameterLimit: 50000,
        })(req, res, next);
      }
    });
  }
}
