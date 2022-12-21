import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { ExpressRequest } from '../types/expressRequest.interface';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';
import mongoose from 'mongoose';

@Injectable()
export class UserAuthMiddleware implements NestMiddleware {
  constructor() {}
  async use(req: ExpressRequest, res: Response, next: NextFunction) {
    console.log('auth middleware kicked ...................');
    if (!req.headers['authorization']) {
      console.log('no auth token provided ---');

      return res.status(403).json({
        status: 'error',
        success: false,
        message: 'token must be provided',
      });
    }
    try {
      let token = req.headers['authorization'].split(' ')[1];
      const decoded = verify(token, JWT_SECRET) as {
        id: mongoose.Schema.Types.ObjectId;
        phone: string;
      };
      console.log('decoded token ' + decoded);

      const userId = decoded.id;
      req.userId = userId;
      console.log('the user from db ====> ' + JSON.stringify(decoded));
      next();
    } catch (err) {
      return res.status(403).json({
        status: 'error',
        success: false,
        message: 'invalid token provided',
      });
    }
  }
}
