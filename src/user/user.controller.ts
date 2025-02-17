import { Body, Controller, Post, Get, ParseIntPipe, Param } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get all users
  @Get("getUsers")
  getUsers() {
    return this.userService.getUsers();
  }

  // Get all chats for a user (expects userId in the request body)
  @Get("getChats/:userId")
  getChats(@Param("userId", ParseIntPipe) userId: number) {
    return this.userService.getChats(userId);
  }
}
