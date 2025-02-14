import { Injectable } from '@nestjs/common';
import { NotificationGateway } from '../gateways/notification/notification.gateway';
import { SingleUserNotificationDto, GlobalNotificationDto, GroupNotificationDto } from '../gateways/notification/dto/notification.dto'

@Injectable()
export class NotificationService {
  constructor(private readonly notificationGateway: NotificationGateway) { }

  sendUserNotification(singleusernotification: SingleUserNotificationDto) {

    this.notificationGateway.sendNotification(singleusernotification);
  }


  sendGlobalNotification(globalnotification: GlobalNotificationDto) {
    this.notificationGateway.sendBroadcastNotification(globalnotification);
  }

  sendGroupNotification(groupnotification: GroupNotificationDto) {
    this.notificationGateway.sendGroupNotification(groupnotification);
  }


}
