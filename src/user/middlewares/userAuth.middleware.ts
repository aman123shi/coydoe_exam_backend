import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { ExpressRequest } from '../types/expressRequest.interface';
import { verify } from 'jsonwebtoken';

import mongoose from 'mongoose';

@Injectable()
export class UserAuthMiddleware implements NestMiddleware {
  constructor() {}
  async use(req: ExpressRequest, res: Response, next: NextFunction) {
    if (!req.headers['authorization']) {
      return res.status(403).json({
        status: 'error',
        success: false,
        message: 'token must be provided',
      });
    }
    try {
      let token = req.headers['authorization'].split(' ')[1];
      console.log(token);

      const decoded = verify(token, process.env.JWT_SECRET) as {
        id: mongoose.Schema.Types.ObjectId;
        phone?: string;
      };

      const userId = decoded.id;
      req.userId = userId;
      next();
    } catch (err) {
      console.log(err);

      return res.status(403).json({
        status: 'error',
        success: false,
        message: 'invalid token provided',
      });
    }
  }
}
