import { Public } from '@app/admin/decorators/publicRoute.decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { ExamCategoryDto } from './dto/exam-category.dto';
import { ExamCategoryService } from './exam-category.service';

@Controller()
export class ExamCategoryController {
  constructor(private readonly examCategoryService: ExamCategoryService) {}

  @Get('exam-categories')
  @Public()
  async getExamCategory() {
    return await this.examCategoryService.getExamCategory();
  }

  @Get('exam-categories-with-courses')
  @Public()
  async getExamCategoriesWithCourses() {
    return await this.examCategoryService.getExamCategoriesWithCourses();
  }

  @Get('get-general-exam-categories')
  @Public()
  async getGeneralExamCategories() {
    return await this.examCategoryService.getGeneralExamCategory();
  }

  @Post('exam-categories')
  async createExamCategory(@Body() examCategoryDto: ExamCategoryDto) {
    return await this.examCategoryService.createExamCategory(examCategoryDto);
  }

  @Put('exam-categories/:id')
  async updateExamCategory(
    @Body() examCategoryDto: ExamCategoryDto,
    @Param('id') id: mongoose.Schema.Types.ObjectId,
  ) {
    return await this.examCategoryService.updateExamCategory(
      id,
      examCategoryDto,
    );
  }

  @Delete('exam-categories/:id')
  async deleteExamCategory(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return await this.examCategoryService.deleteExamCategory(id);
  }
}
