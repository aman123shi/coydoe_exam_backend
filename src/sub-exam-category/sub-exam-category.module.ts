import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubExamCategoryController } from './sub-exam-category.controller';
import { SubExamCategoryEntity } from './sub-exam-category.entity';
import { SubExamCategoryService } from './sub-exam-category.service';

@Module({
  controllers: [SubExamCategoryController],
  providers: [SubExamCategoryService],
  imports: [TypeOrmModule.forFeature([SubExamCategoryEntity])],
  exports: [SubExamCategoryService],
})
export class SubExamCategoryModule {}
//natural social
