import { Module } from '@nestjs/common';

import { AdminController } from '@app/admin/admin.controller';
import { AdminService } from '@app/admin/admin.service';
import { AdminGuard } from './guards/admin.guard';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AdminNotification,
  AdminNotificationSchema,
} from './schemas/adminNotification.schema';
@Module({
  providers: [AdminService, AdminGuard],
  controllers: [AdminController],
  exports: [AdminService],
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: AdminNotification.name, schema: AdminNotificationSchema },
    ]),
  ],
})
export class AdminModule {}
