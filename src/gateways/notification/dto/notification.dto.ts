// notification.dto.ts
import { IsNotEmpty, IsString, IsArray } from "class-validator"
export class SingleUserNotificationDto {

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}

export class GroupNotificationDto {
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  userIds: string[];

  @IsNotEmpty()
  @IsString()
  message: string;
}

export class GlobalNotificationDto {

  @IsNotEmpty()
  @IsString()
  message: string;
}
