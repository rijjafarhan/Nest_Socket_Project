import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { PrismaService } from 'src/prisma/prisma.service'
import { PrismaModule } from 'src/prisma/prisma.module'
import { JwtModule } from '@nestjs/jwt'
import { ChatService } from "./chat.service";
import { ChatGateway } from "./chat.gateway";

@Module({
    imports: [PrismaModule,JwtModule.register({})],
    controllers:[ChatController],
    providers:[ChatService, PrismaService,ChatGateway]
})

export class AuthModule{}