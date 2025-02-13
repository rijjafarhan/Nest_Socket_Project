import { Injectable } from '@nestjs/common';
import { NotificationGateway } from '../gateways/notification/notification.gateway';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationGateway: NotificationGateway) {}

  sendUserNotification(userId: string, message: string) {
    this.notificationGateway.sendNotification(userId, message);
  }

  sendGlobalNotification(message: string) {
    this.notificationGateway.sendBroadcastNotification(message);
  }

  sendGroupNotification(userIds: string[], message: string)
  {
    this.notificationGateway.sendGroupNotification(userIds, message);
  }

  
}
