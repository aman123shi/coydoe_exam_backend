import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from '@app/admin/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity])],
})
export class AdminModule {}
