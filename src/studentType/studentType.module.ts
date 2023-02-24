import { Module } from '@nestjs/common';
import { StudentTypeController } from './studentType.controller';
import { StudentTypeService } from './studentType.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentType, StudentTypeSchema } from './schemas/studentType.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudentType.name, schema: StudentTypeSchema },
    ]),
  ],
  controllers: [StudentTypeController],
  providers: [StudentTypeService],
})
export class StudentTypeModule {}
