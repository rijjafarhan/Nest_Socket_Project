import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { MessageDto } from "./dto/message.dto";

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async saveMessage(dto: MessageDto) {
    const { chatId, senderId, receiverId, content } = dto;
  
    if (!chatId || !senderId || !receiverId || !content.trim()) {
      throw new BadRequestException("Invalid message data.");
    }
  
  
    try {
      // First, ensure the chat exists or create it
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
  
      // Then create the message
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
}