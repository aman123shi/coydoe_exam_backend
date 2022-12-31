import { PartialType } from '@nestjs/mapped-types';
import { CreateNotificationDto } from './createNotification.dto';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {}
