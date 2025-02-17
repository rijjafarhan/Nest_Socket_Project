import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MessageService } from "./message.service";
import { MessageDto } from "./dto/message.dto";

@WebSocketGateway({ cors: true })
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private messageService: MessageService) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("sendMessage")
  async handleSendMessage(@MessageBody() message: MessageDto, @ConnectedSocket() client: Socket) {
    console.log("Message received on server:", message);
  
    try {
      const savedMessage = await this.messageService.saveMessage(message);
      // Emit only to the specific chat room
      this.server.to(String(message.chatId)).emit("messageReceived", savedMessage);

    } catch (error) {
      console.error("Error sending message:", error);
      client.emit("error", { message: "Message could not be sent." });
    }
  }

  @SubscribeMessage("joinChat")
  async handleJoinChat(@MessageBody() chatId: string, @ConnectedSocket() client: Socket) {
    client.join(chatId);
    console.log(`Client ${client.id} joined chat ${chatId}`);
  }

  @SubscribeMessage("leaveChat")
  async handleLeaveChat(@MessageBody() chatId: string, @ConnectedSocket() client: Socket) {
    client.leave(chatId);
    console.log(`Client ${client.id} left chat ${chatId}`);
  }
}