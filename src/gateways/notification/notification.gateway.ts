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

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private activeUsers = new Map<string, string>();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // No 'data' variable; we assume user registration happens later
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

  @SubscribeMessage('registerUser') // Corrected event name
  handleRegister(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('user:', data);
    // Register user with the socket ID
    this.activeUsers.set(data.userId, client.id);  // Use userId field for registration
    console.log(`User ${data.userId} registered with socket ID: ${client.id}`);
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

  sendNotification(@MessageBody() userId: string, message: string) {
    console.log('userId:', userId);
    console.log('message:', message);

    const socketId = this.activeUsers.get(userId);
    if (socketId) {
      console.log('Sending notification to:', userId);
      this.server.to(socketId).emit('notification', { message });
    } else {
      console.log(`User ${userId} is not connected.`);
    }
  }

  sendBroadcastNotification(message: string) {
    this.server.emit('notification', { message }); // Send to all connected clients
  }

  sendGroupNotification(@MessageBody() userIds: string[], message: string) {
    console.log(userIds);

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
}
