import { Module } from '@nestjs/common';
import { NotificationModule } from './socket/socket.module';

@Module({
  imports: [NotificationModule],
})
export class AppModule {}
