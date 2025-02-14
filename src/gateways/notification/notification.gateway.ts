import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GlobalNotificationDto, GroupNotificationDto, SingleUserNotificationDto } from './dto/notification.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private activeUsers = new Map<string, string>();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    client.broadcast.emit('user-joined', {
      message: `New user joined with client id: ${client.id}`,
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.server.emit('user-left', {
      message: `User left: ${client.id}`,
    });

    // Clean up from activeUsers map
    for (const [userId, socketId] of this.activeUsers.entries()) {
      if (socketId === client.id) {
        this.activeUsers.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('newNotification')
  handleNewMessage(@MessageBody() message: string) {
    this.server.emit('message', message);
  }

  @SubscribeMessage('registerUser')
  handleRegister(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('user:', data);
    if (this.activeUsers.has(data.userId)) {
      console.log(`User ${data.userId} is already registered with socket ID: ${this.activeUsers.get(data.userId)}`);
      client.emit('registrationError', { message: 'User is already registered.' });
    } else {
      this.activeUsers.set(data.userId, client.id);
      console.log(`User ${data.userId} registered with socket ID: ${client.id}`);
    }
  }


  @SubscribeMessage('getRegisteredClients')
  getRegisteredClients(@ConnectedSocket() client: Socket) {
    const users = Array.from(this.activeUsers.entries()).map(([userId, socketId]) => ({
      userId,
      socketId,
    }));

    console.log('Registered Clients:', users);

    // Send the list of registered clients to the requesting client
    client.emit('registeredClients', users);
  }

  sendNotification(@MessageBody() data: SingleUserNotificationDto) {
    const { userId, message } = data
    console.log('userId:', userId);
    console.log('message:', message);

    try {
      const socketId = this.activeUsers.get(userId);
      if (socketId) {
        console.log('Sending notification to:', userId);
        this.server.to(socketId).emit('notification', { message });
      } else {
        console.log(`User ${userId} is not connected.`);
      }
    }
    catch (error) {
      console.error('Error in sending a notification:', error);
    }
  }

  sendBroadcastNotification(data: GlobalNotificationDto) {

    try {
      const { message } = data
      this.server.emit('notification', { message }); // Send to all connected clients
    }
    catch (error) {
      console.error('Error sending global notification:', error);
    }
  }

  sendGroupNotification(@MessageBody() data: GroupNotificationDto) {
    const { userIds, message } = data
    console.log(userIds);
    try {
      userIds.forEach((userId) => {
        const socketId = this.activeUsers.get(userId);
        if (socketId) {
          this.server.to(socketId).emit('notification', { message });
          console.log(`Notification sent to ${userId}`);
        } else {
          console.log(`User ${userId} is not connected.`);
        }
      });
    }
    catch (error) {
      console.error('Error sending group notification:', error);
    }
  }


}
