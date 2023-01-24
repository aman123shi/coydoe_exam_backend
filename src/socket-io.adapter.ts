import { INestApplicationContext, Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { verify } from 'jsonwebtoken';
import { Server, ServerOptions } from 'socket.io';
import { JWT_SECRET } from './config';
import { SocketWithAuth } from './notification/types/socket-with-auth';

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);
  constructor(private app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const cors = {
      origin: ['*', 'http://127.0.0.1:5173', 'http://localhost:5173', '**'], //add other cors option here
    };

    const optionsWithCORS: ServerOptions = {
      ...options,
      cors,
    };

    const server: Server = super.createIOServer(port, optionsWithCORS);

    server.of('notifications').use(createTokenMiddleware(this.logger));

    return server;
  }
}

const createTokenMiddleware =
  (logger: Logger) => (socket: SocketWithAuth, next: any) => {
    // for Postman testing support, fallback to token header
    const token =
      socket.handshake.auth.token || socket.handshake.headers['token'];
    if (!token) next(new Error('FORBIDDEN PLEASE PROVIDE SOCKET TOKEN'));

    try {
      const payload = verify(token, JWT_SECRET) as {
        id: string;
        phone: string;
      };
      socket.userId = payload.id;

      next();
    } catch {
      next(new Error('FORBIDDEN PLEASE PROVIDE VALID SOCKET TOKEN'));
      logger.debug(`Valid socket Auth Token should be provided `);
    }
  };
