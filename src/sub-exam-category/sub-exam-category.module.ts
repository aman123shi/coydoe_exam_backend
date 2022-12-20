import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  SubExamCategory,
  SubExamCategorySchema,
} from './schemas/subExamCategory.schema';
import { SubExamCategoryController } from './sub-exam-category.controller';
import { SubExamCategoryEntity } from './sub-exam-category.entity';
import { SubExamCategoryService } from './sub-exam-category.service';

@Module({
  controllers: [SubExamCategoryController],
  providers: [SubExamCategoryService],
  imports: [
    TypeOrmModule.forFeature([SubExamCategoryEntity]),
    MongooseModule.forFeature([
      { name: SubExamCategory.name, schema: SubExamCategorySchema },
    ]),
  ],
  exports: [SubExamCategoryService],
})
export class SubExamCategoryModule {}
//natural social
