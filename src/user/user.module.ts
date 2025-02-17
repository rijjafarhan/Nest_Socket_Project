import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { PrismaService } from 'src/prisma/prisma.service'
import { PrismaModule } from 'src/prisma/prisma.module'
import { JwtModule } from '@nestjs/jwt'
import { UserService } from "./user.service";

@Module({
    imports: [PrismaModule,JwtModule.register({})],
    controllers:[UserController],
    providers:[UserService, PrismaService]
})

export class UserModule{}