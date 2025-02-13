import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './socket.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('user')
  sendUserNotification(@Body() body: { userId: string; message: string }) {
    this.notificationService.sendUserNotification(body.userId, body.message);
    return { message: 'Notification sent to user' };
  }

  @Post('global')
  sendGlobalNotification(@Body() body: { message: string }) {
    this.notificationService.sendGlobalNotification(body.message);
    return { message: 'Global notification sent' };
  }

  @Post('group')
  sendGroupNotification(@Body() body: { userIds: string[]; message: string }) {
    this.notificationService.sendGroupNotification(body.userIds,body.message);
    return { message: 'Global notification sent' };
  }
}
