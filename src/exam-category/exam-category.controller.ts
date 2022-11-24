import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ExamCategoryDto } from './dto/exam-category.dto';
import { ExamCategoryService } from './exam-category.service';

@Controller()
export class ExamCategoryController {
  constructor(private readonly examCategoryService: ExamCategoryService) {}

  @Get('exam-categories')
  async getExamCategory() {
    return await this.examCategoryService.getExamCategory();
  }

  @Post('exam-categories')
  async createExamCategory(@Body() examCategoryDto: ExamCategoryDto) {
    return await this.examCategoryService.createExamCategory(examCategoryDto);
  }

  @Put('exam-categories/:id')
  async updateExamCategory(
    @Body() examCategoryDto: ExamCategoryDto,
    @Param('id') id: number,
  ) {
    return await this.examCategoryService.updateExamCategory(
      id,
      examCategoryDto,
    );
  }

  @Delete('exam-categories/:id')
  async deleteExamCategory(@Param('id') id: number) {
    return await this.examCategoryService.deleteExamCategory(id);
  }
}
