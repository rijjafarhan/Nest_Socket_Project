import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { PrismaService } from 'src/prisma/prisma.service'
import { PrismaModule } from 'src/prisma/prisma.module'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './strategy'
import { AuthService } from "./auth.service";

@Module({
    imports: [PrismaModule,JwtModule.register({})],
    controllers:[AuthController],
    providers:[AuthService, PrismaService,JwtStrategy]
})

export class AuthModule{}