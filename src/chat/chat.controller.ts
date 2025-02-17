import { Body, Controller, Post, UsePipes, ValidationPipe,Get, Param, HttpException, HttpStatus } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { CreateChatDto } from "./dto/chat.dto";


@Controller('chat')
export class ChatController{
  constructor (private chatService:ChatService){}
   
  @Post("create")
  @UsePipes(new ValidationPipe({ transform: true })) 
  async createChat(@Body() dto: CreateChatDto) {
    
    dto.memberIds = dto.memberIds.map(id => Number(id)); 
    return this.chatService.createChat(dto);
  }

  @Get('/:chatId/messages')
  async getMessages(@Param('chatId') chatId: number) {
    try {
   
      if (isNaN(chatId) || chatId <= 0) {
        throw new HttpException('Invalid chat ID', HttpStatus.BAD_REQUEST);
      }
      const messages = await this.chatService.getMessagesByChatId(chatId);
      return { success: true, messages };
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new HttpException(
        error.message || 'Failed to fetch messages',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


}