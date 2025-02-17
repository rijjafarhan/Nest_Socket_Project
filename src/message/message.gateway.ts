import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MessageService } from "./message.service";
import { MessageDto , GroupMessageDto} from "./dto/message.dto";

@WebSocketGateway({ cors: true })
export class MessageGateway  {
  @WebSocketServer()
  server: Server;

  constructor(private messageService: MessageService) {}

  

  @SubscribeMessage("sendMessage")
  async handleSendMessage(@MessageBody() message: MessageDto, @ConnectedSocket() client: Socket) {
    console.log("Message received on server:", message);
  
    try {
      const savedMessage = await this.messageService.saveMessage(message);
     
      this.server.to(String(message.chatId)).emit("messageReceived", savedMessage);

    } catch (error) {
      console.error("Error sending message:", error);
      client.emit("error", { message: "Message could not be sent." });
    }
  }


  @SubscribeMessage('sendGroupMessage')
  async handleGroupMessage(
    @MessageBody() groupMessageDto: GroupMessageDto,
    @ConnectedSocket() client: Socket
  ) {
    try {
     
    

    
      const chat = await this.messageService.findChatById(groupMessageDto.chatId);
      if (!chat) {
        client.emit('error', { message: 'Chat not found' });
        return;
      }

     
      if (!chat.members.some(member => member.id === groupMessageDto.senderId)) {
        client.emit('error', { message: 'Sender is not a member of the group' });
        return;
      }
      
      const message = await this.messageService.createGroupMessage(groupMessageDto);

     
      this.server.to(groupMessageDto.chatId.toString()).emit('messageReceived', message);

      
      client.emit('messageSent', message);
    } catch (error) {
      console.error('Error handling group message:', error);
      client.emit('error', { message: 'Failed to send message' });
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