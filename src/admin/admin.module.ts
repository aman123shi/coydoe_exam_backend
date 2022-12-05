import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from '@app/admin/admin.entity';
import { AdminController } from '@app/admin/admin.controller';
import { AdminService } from '@app/admin/admin.service';
import { AdminGuard } from './guards/admin.guard';

@Module({
  providers: [AdminService, AdminGuard],
  controllers: [AdminController],
  exports: [AdminService],
  imports: [TypeOrmModule.forFeature([AdminEntity])],
})
export class AdminModule {}
