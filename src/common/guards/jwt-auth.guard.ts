import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtUtilsService } from '../../helper-modules/jwt-utils/jwt-utils.service';
import { Reflector } from '@nestjs/core';
import { publicDecoratorKey } from '../decorators/public.decorator';
import { sameUserKey } from '../decorators/same-user.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtUtilsService: JwtUtilsService,
    private readonly reflector: Reflector,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      publicDecoratorKey,
      [context.getHandler(), context.getClass()],
    );
    const sameUserCheck = this.reflector.getAllAndOverride<boolean>(
      sameUserKey,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }
    try {
      const payload = this.jwtUtilsService.validateToken(token);
      const { username } = payload;
      request['user'] = username;
      if (sameUserCheck) {
        const providedUsername =
          request.query.username ||
          request.body.username ||
          request.params.username;
        if (username === providedUsername) {
          return true;
        }
        throw new ForbiddenException('Forbidden action');
      }
      return true;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
