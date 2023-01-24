import { JWT_SECRET } from '@app/config';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from '../decorators/publicUserRoute.decorator';
export class UserGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(ctx: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;

    let request = ctx.switchToHttp().getRequest<Request>();
    if (!request.headers.authorization) return false;
    let token = request.headers.authorization.split('')[1];

    try {
      let user = verify(token, JWT_SECRET);
      if (user) {
        return true;
      }
    } catch (error) {
      throw new HttpException(
        'User AnAuthorized please Login First',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
