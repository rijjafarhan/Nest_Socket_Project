import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MessageGateway } from './message/message.gateway';
import { MessageService } from './message/message.service';
import { ChatGateway } from './chat/chat.gateway';
import { ChatService } from './chat/chat.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Make ConfigModule global
    PrismaModule,
    AuthModule,
    UserModule,
  ],
  providers: [MessageGateway,MessageService,ChatGateway,ChatService], // WebSocket gateway should be in providers
})
export class AppModule {}
