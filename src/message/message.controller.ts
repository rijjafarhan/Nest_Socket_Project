import { Body, Controller, Post } from "@nestjs/common";
import { MessageService } from "./message.service";
import { MessageDto } from "./dto/message.dto";


@Controller('message')
export class MessageController{
  constructor (private messageService:MessageService){}
   
  @Post("create")
  create(@Body() dto:MessageDto)
  {
    return this.messageService.saveMessage(dto)
  }


}