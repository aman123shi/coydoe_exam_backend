import { UserService } from '@app/user/user.service';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { SocketWithAuth } from './types/socket-with-auth';

@WebSocketGateway({
  namespace: 'notifications',
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly userService: UserService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: any): Promise<void> {
    this.server.emit('recMessage', payload);
  }

  afterInit(server: Server) {
    console.log(server.sockets);
    //Do stuffs
  }

  handleConnection(client: SocketWithAuth, ...args: any[]) {
    console.log(
      `Connected with socket id  ${client.id} and with user id ${client.userId}`,
    );
    //change user online status and save notification push socket.id
    this.userService.updateUserStatus({
      userId: client.userId,
      isOnline: true,
      socketId: client.id,
    });
    this.sendNotification({
      socketId: client.id,
      data: 'private message only to you',
    });
  }

  handleDisconnect(client: SocketWithAuth) {
    console.log(`Disconnected: ${client.id} and userID ${client.userId}`);
    //change user online status when disconnected
    this.userService.updateUserStatus({
      userId: client.userId,
      isOnline: false,
    });
  }
  sendNotification({ socketId, data }) {
    this.server.to(socketId).emit('newNotification', data);
  }
}
