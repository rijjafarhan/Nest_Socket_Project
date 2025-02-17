import { Module } from "@nestjs/common";
import { MessageController } from "./message.controller";
import { PrismaService } from 'src/prisma/prisma.service'
import { PrismaModule } from 'src/prisma/prisma.module'
import { JwtModule } from '@nestjs/jwt'
import {    MessageService } from "./message.service";

@Module({
    imports: [PrismaModule,JwtModule.register({})],
    controllers:[MessageController],
    providers:[MessageService, PrismaService]
})

export class AuthModule{}