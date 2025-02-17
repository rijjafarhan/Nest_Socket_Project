import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateChatDto } from "./dto/chat.dto";

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createChat(dto: CreateChatDto) {
    console.log("in create chat service")
    const { memberIds, name, isGroup ,userId} = dto;
    const numericMemberIds = memberIds.map((id) => Number(id));
    if (!memberIds || memberIds.length < 2) {
      throw new BadRequestException("A chat must have at least two valid members.");
    }
    if (!isGroup) {
      const existingChat = await this.prisma.chat.findFirst({
        where: {
          isGroup: false,
          members: {
            every: {
              id: { in: numericMemberIds },  
            },
          },
        },
        include: {
          members: true,
        },
      });
      if (existingChat) {
        throw new BadRequestException("A private chat already exists with the same members.");
      }
    }
    try {
      let chatName = name || "";
    if (!chatName) {
      console.log("user id: ",userId)
      const otherUser = await this.prisma.user.findFirst({
        where: { 
          id: { not: userId }, 
        },
        select: { name: true },
      });
    
      if (otherUser) {
        chatName = otherUser.name; 
      }
    }
    
    console.log("chat name: ",chatName)
      const chat = await this.prisma.chat.create({
        data: {
          name: chatName, 
          isGroup: isGroup ?? numericMemberIds.length > 2, 
          members: {
            connect: numericMemberIds.map((id) => ({ id })), 
          },
        },
        include: {
          members: true, 
        },
      });

      
      await Promise.all(
        numericMemberIds.map(async (userId) => {
          await this.prisma.user.update({
            where: { id: userId },
            data: {
              chats: {
                connect: { id: chat.id }, 
              },
            },
          });
        })
      );

      return chat;
    } catch (error) {
      console.error("Error creating chat:", error);
      throw new BadRequestException("Could not create chat");
    }
  }

  async getMessagesByChatId(chatId: number) {
    console.log("in geting msgs chat service")
    return this.prisma.message.findMany({
      where: { chatId: Number(chatId) }, 
      orderBy: { timestamp: 'asc' },
    });
  }
}
