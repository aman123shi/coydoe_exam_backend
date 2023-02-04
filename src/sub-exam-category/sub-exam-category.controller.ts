import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SubExamCategoryDto } from '@app/sub-exam-category/dto/sub-exam-category.dto';
import { SubExamCategoryService } from '@app/sub-exam-category/sub-exam-category.service';
import mongoose from 'mongoose';

@Controller()
export class SubExamCategoryController {
  constructor(
    private readonly subExamCategoryService: SubExamCategoryService,
  ) {}

  @Get('sub-exam-categories')
  async getSubExamCategory() {
    return await this.subExamCategoryService.getSubExamCategory();
  }

  @Get('sub-exam-categories/:categoryId')
  async getSubExamCategoryByCategoryId(
    @Param('categoryId') id: mongoose.Schema.Types.ObjectId,
  ) {
    return await this.subExamCategoryService.getSubExamCategoryByCategoryId(id);
  }

  @Post('sub-exam-categories')
  async createSubExamCategory(@Body() examCategoryDto: SubExamCategoryDto) {
    return await this.subExamCategoryService.createSubExamCategory(
      examCategoryDto,
    );
  }

  @Put('sub-exam-categories/:id')
  async updateSubExamCategory(
    @Body() examCategoryDto: SubExamCategoryDto,
    @Param('id') id: mongoose.Schema.Types.ObjectId,
  ) {
    return await this.subExamCategoryService.updateSubExamCategory(
      id,
      examCategoryDto,
    );
  }

  @Delete('sub-exam-categories/:id')
  async deleteSubExamCategory(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return await this.subExamCategoryService.deleteSubExamCategory(id);
  }
}
