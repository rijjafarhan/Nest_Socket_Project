import { IsNotEmpty, IsString, IsInt,IsBoolean } from "class-validator";

export class MessageDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsInt()
  senderId: number;

  @IsNotEmpty()
  @IsInt()
  receiverId: number;

  @IsNotEmpty()
  @IsInt()
  chatId: number;

  
  sender?: { connect: { id: number } };
  reciever?: { connect: { id: number } };
}



export class GroupMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string; 

  @IsNotEmpty()
  @IsInt()
  senderId: number;

  @IsNotEmpty()
  @IsInt()
  chatId: number;


  
  
 
  sender?: { connect: { id: number } }; 
  group?: { connect: { id: number } }; 
}