import {  IsNotEmpty, IsString } from "class-validator";


export class MessageDto {
  @IsNotEmpty()
  @IsString()
  content:string

  @IsNotEmpty()
  senderId: number

  @IsNotEmpty()
  receiverId: number

  @IsNotEmpty()
  chatId:number

}
