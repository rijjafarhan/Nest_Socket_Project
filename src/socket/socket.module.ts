import { Module } from '@nestjs/common';
import { NotificationGateway } from '../gateways/notification/notification.gateway';
import { NotificationService } from './socket.service';
import { NotificationController } from './socket.controller'

@Module({
  providers: [NotificationGateway,NotificationService],
  exports: [NotificationGateway], 
  controllers: [NotificationController]
})
export class NotificationModule {}
