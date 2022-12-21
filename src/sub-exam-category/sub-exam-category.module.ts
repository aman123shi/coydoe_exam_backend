import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SubExamCategory,
  SubExamCategorySchema,
} from './schemas/subExamCategory.schema';
import { SubExamCategoryController } from './sub-exam-category.controller';
import { SubExamCategoryService } from './sub-exam-category.service';

@Module({
  controllers: [SubExamCategoryController],
  providers: [SubExamCategoryService],
  imports: [
    MongooseModule.forFeature([
      { name: SubExamCategory.name, schema: SubExamCategorySchema },
    ]),
  ],
  exports: [SubExamCategoryService, MongooseModule],
})
export class SubExamCategoryModule {}
//natural social
