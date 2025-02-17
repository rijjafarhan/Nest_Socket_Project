
import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
      return users;
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }
  async getChats(userId: number) {
    try {
      const chats = await this.prisma.chat.findMany({
        where: {
          members: {
            some: {
              id: userId, // Ensure the field name matches your schema
            },
          },
        },
        include: {
          members: {
            select: {
              id: true, // Selecting the member's ID
              name: true,
              email: true,
            },
          },
        },
      });
  
      return chats;
    } catch (error) {
      throw new Error(`Error fetching chats: ${error.message}`);
    }
  }
  

  
}
