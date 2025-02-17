import { Body, Controller, Post, UsePipes, ValidationPipe,Get, Param, HttpException, HttpStatus } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { CreateChatDto } from "./dto/chat.dto";


@Controller('chat')
export class ChatController{
  constructor (private chatService:ChatService){}
   
  @Post("create")
  @UsePipes(new ValidationPipe({ transform: true })) // Enable automatic transformation
  async createChat(@Body() dto: CreateChatDto) {
    // Convert string IDs to numbers using ParseIntPipe
    dto.memberIds = dto.memberIds.map(id => Number(id)); 
    return this.chatService.createChat(dto);
  }

  @Get('/:chatId/messages')
  async getMessages(@Param('chatId') chatId: string) {
    try {
      console.log("in getting msgs")
      // Validate chatId if necessary
      const chatIdNumber = parseInt(chatId, 10);
      if (isNaN(chatIdNumber)) {
        throw new HttpException('Invalid chat ID', HttpStatus.BAD_REQUEST);
      }

      // Fetch messages from the service
      const messages = await this.chatService.getMessagesByChatId(chatIdNumber);
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