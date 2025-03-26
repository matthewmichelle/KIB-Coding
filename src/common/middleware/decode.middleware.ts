import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { decode } from 'jsonwebtoken';
import { UnauthorizedError } from '../types/error-types.data';

@Injectable()
export class DecodeMiddleware implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request: any = context.switchToHttp().getRequest<Request>();

    try {
      const authorization = request.headers.authorization?.split(' ')[1];

      if (!authorization) {
        throw new UnauthorizedError();
      }

      const data: any = decode(authorization);

      if (data?.sub?.userInfo) {
        // Attach user info to the request object
        request.user = data.sub.userInfo;
        return true; // Allow access
      }

      throw new UnauthorizedError();
    } catch (error) {
      throw new UnauthorizedError();
    }
  }
}
