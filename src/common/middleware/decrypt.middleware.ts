import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { privateDecrypt } from 'crypto';
import { readFileSync } from 'fs'; // Import readFileSync from fs module
import { Logger } from '@nestjs/common';
import { UnauthorizedError } from '../types/error-types.data';

@Injectable()
export class DecryptMiddleware implements NestMiddleware {
  private readonly logger = new Logger(DecryptMiddleware.name);
  private readonly privateKey: string;

  constructor() {
    // Load the private key once during middleware initialization
    const keyPath = process.env.KEY_PATH || './keys/';
    const filePath = `${keyPath}private.pem`;
    this.privateKey = readFileSync(filePath, 'utf8');
  }

  use(req: Request, _: Response, next: NextFunction): void {
    try {
      if (req.headers['method'] === 'encryption') {
        const passphrase = process.env.PRIVATE_KEY_PASSPHRASE || '';
        Object.keys(req.body).forEach((field) => {
          try {
            console.log(req.body[field])
            const buffer = Buffer.from(req.body[field], 'base64');
            const decodedData = privateDecrypt(
              {
                key: this.privateKey,
                passphrase,
              },
              buffer,
            );
            req.body[field] = decodedData.toString();
          } catch (error) {
            this.logger.error(
              `Error decrypting field '${field}': ${error}`,
            );
          }
        });
      }
      next();
    } catch (error) {
      this.logger.error(`Middleware Error: ${error}`);
      throw new UnauthorizedError();
    }
  }
}
