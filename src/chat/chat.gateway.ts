import { 
    WebSocketGateway, 
    SubscribeMessage, 
    MessageBody, 
    ConnectedSocket, 
    WebSocketServer 
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { CreateChatDto } from './dto/chat.dto';
  import { ChatService } from '../chat/chat.service';
  
  @WebSocketGateway({ cors: true }) // Allow frontend connections
  export class ChatGateway {
    @WebSocketServer()
    server: Server;
  
    constructor(private readonly chatService: ChatService) {}
  
    @SubscribeMessage('createChat')
    async handleCreateChat(
      @MessageBody() dto: CreateChatDto,
      @ConnectedSocket() client: Socket
    ) {
      console.log("Creating chat with members:", dto.memberIds);
    
      try {
        // Ensure the dto contains memberIds
        if (!dto.memberIds || dto.memberIds.length < 2) {
          client.emit('error', { message: 'A chat must have at least two members.' });
          return;
        }
  
        // Call the chat service to create the chat
        const newChat = await this.chatService.createChat(dto);
  
        // Emit the new chat details back to the client who created it
        client.emit('chatCreated', newChat);
  
        // Notify all chat members about the new chat
        newChat.members.forEach(member => {
          const room = `user_${member.id}`;
          client.to(room).emit('newChat', newChat);
        });
  
      } catch (error) {
        console.error('Error creating chat:', error);
        client.emit('error', { message: 'Failed to create chat' });
      }
    }
  }
  