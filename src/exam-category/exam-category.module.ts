import { CourseModule } from '@app/course/course.module';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamCategoryController } from './exam-category.controller';
import { ExamCategoryEntity } from './exam-category.entity';
import { ExamCategoryService } from './exam-category.service';
import {
  ExamCategory,
  ExamCategorySchema,
} from './schemas/examCategory.schema';

@Module({
  controllers: [ExamCategoryController],
  providers: [ExamCategoryService],
  imports: [
    TypeOrmModule.forFeature([ExamCategoryEntity]),
    MongooseModule.forFeature([
      { name: ExamCategory.name, schema: ExamCategorySchema },
    ]),

    forwardRef(() => CourseModule),
  ],
  exports: [ExamCategoryService],
})
export class ExamCategoryModule {}
//Entrance Coc Bank
