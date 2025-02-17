import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateChatDto } from "./dto/chat.dto";

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createChat(dto: CreateChatDto) {
    const { memberIds, name, isGroup } = dto;

    // Ensure all memberIds are valid
    if (!memberIds || memberIds.length < 2) {
      throw new BadRequestException("A chat must have at least two valid members.");
    }

    try {
      // Convert all memberIds to integers before passing to Prisma
      const numericMemberIds = memberIds.map((id) => Number(id));

      // Create the chat
      const chat = await this.prisma.chat.create({
        data: {
          name: name || "", // Default name if none provided
          isGroup: isGroup ?? numericMemberIds.length > 2, // Determine if it's a group
          members: {
            connect: numericMemberIds.map((id) => ({ id })), // Connect users to the chat
          },
        },
        include: {
          members: true, // Include chat members in the response
        },
      });

      // Update each user to add this chat to their chat list
      await Promise.all(
        numericMemberIds.map(async (userId) => {
          await this.prisma.user.update({
            where: { id: userId },
            data: {
              chats: {
                connect: { id: chat.id }, // Connect the chat to the user's chat array
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
  return this.prisma.message.findMany({
    where: { chatId },
    orderBy: { timestamp: 'asc' }, // Sort messages by timestamp if needed
  });

}

}
