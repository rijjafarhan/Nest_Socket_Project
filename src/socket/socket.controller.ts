import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './socket.service';
import { SingleUserNotificationDto, GlobalNotificationDto, GroupNotificationDto } from '../gateways/notification/dto/notification.dto'

@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Post('user')
    sendUserNotification(@Body() singleusernotification: SingleUserNotificationDto) {
        this.notificationService.sendUserNotification(singleusernotification);
        return { message: 'Notification sent to user' };
    }

    @Post('global')
    sendGlobalNotification(@Body() globalnotification: GlobalNotificationDto) {
        this.notificationService.sendGlobalNotification(globalnotification);
        return { message: 'Global notification sent' };
    }

    @Post('group')
    sendGroupNotification(@Body() groupnotification: GroupNotificationDto) {
        this.notificationService.sendGroupNotification(groupnotification);
        return { message: 'Global notification sent' };
    }
}
