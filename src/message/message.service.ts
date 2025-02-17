import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { MessageDto ,GroupMessageDto} from "./dto/message.dto";

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async saveMessage(dto: MessageDto) {
    
    const { chatId, senderId, receiverId, content } = dto;
  console.log("existing chat id: ",chatId)
    if (!chatId || !senderId || !receiverId || !content.trim()) {
      throw new BadRequestException("Invalid message data.");
    }
  
  
    try {
   
      const chat = await this.prisma.chat.upsert({
        where: { id: Number(chatId) },
        create: {
          id:  Number(chatId),
          members: {
            connect: [
              { id: Number(senderId) },
              { id: Number(receiverId) }
            ]
          }
          
        },
        update: {}
      });
  
      
      const numericReceiverId = Number(receiverId);

      const message = await this.prisma.message.create({
        data: {
          content,
          chatId: chat.id,
          senderId,
          receiverId:numericReceiverId
        },
        select: {
          id: true,
          content: true,
          senderId: true,
          receiverId: true,
          createdAt: true
        }
      });
  
      return message;
    } catch (error) {
      console.error("Error saving message:", error);
      throw new BadRequestException("Could not save message.");
    }
  }
  async findChatById(chatId: number) {
    try {
      const chat = await this.prisma.chat.findUnique({
        where: { id: Number(chatId) },
        include: {
          members: true, 
        },
      });

    
      if (!chat) {
        return null;
      }

      return chat;
    } catch (error) {
      console.error('Error finding chat by ID:', error);
      throw new Error('Error fetching chat details');
    }
  }

  async createGroupMessage(dto: GroupMessageDto) {
    try {
      console.log("in create message for group")
     
      const newMessage = await this.prisma.message.create({
        data: {
          content: dto.content,
          chat: { connect: { id: Number(dto.chatId) } }, 
          sender: { connect: { id: dto.senderId } }, 
        },
      });

      return newMessage;
    } catch (error) {
      console.error('Error creating group message:', error);
      throw new Error('Error sending message');
    }
  }
}