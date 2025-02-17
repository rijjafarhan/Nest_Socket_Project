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

  // Method to create a chat
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

      const newChat = await this.chatService.createChat(dto);
  
      // Emit a successful chat creation
      client.emit('chatCreated', newChat);
  
      // Notify all members of the new chat
      newChat.members.forEach(member => {
        const room = `user_${member.id}`;
        client.to(room).emit('newChat', newChat);
      });
  
    } catch (error) {
      console.error('Error creating chat:', error);
      client.emit('error', { message: 'Failed to create chat' });
    }
  }

  // Method to handle users joining a chat room
  @SubscribeMessage('joinChat')
  handleJoinChat(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: Socket
  ) {
    console.log(`User ${client.id} is joining chat room: ${chatId}`);
    
    try {
     
      client.join(chatId);
      console.log(`User ${client.id} has joined the room: ${chatId}`);

    
      client.emit('joinedChat', { chatId, message: 'You have successfully joined the chat.' });

   
      this.server.to(chatId).emit('newMemberJoined', { userId: client.id, chatId });

    } catch (error) {
      console.error('Error joining chat:', error);
      client.emit('error', { message: 'Failed to join the chat.' });
    }
  }
}
