import { Socket } from 'socket.io';
export type SocketWithAuth = Socket & { userId: string };
