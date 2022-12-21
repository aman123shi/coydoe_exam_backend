import { Public } from '@app/admin/decorators/publicRoute.decorators';
import { AdminGuard } from '@app/admin/guards/admin.guard';
import { ExpressRequest } from '@app/user/types/expressRequest.interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { GetQuestionDto } from './dto/getQuestion.dto';
import { UpdateQuestionDto } from './dto/updateQuestion.dto';
import { QuestionService } from './question.service';

@Controller()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('questions')
  @Public()
  async getQuestion(
    @Body() getQuestionDto: GetQuestionDto,
    @Req() request: ExpressRequest,
  ) {
    return await this.questionService.getQuestion(
      getQuestionDto,
      request.userId,
    );
  }
  @Get('questions/free')
  @Public()
  async getFreeQuestion(@Body() getQuestionDto: GetQuestionDto) {
    return await this.questionService.getRandomQuestion(getQuestionDto);
  }
  @Get('questions/courses/get-years/:id')
  async getAvailableYears(
    @Param('id') courseId: mongoose.Schema.Types.ObjectId,
  ) {
    return await this.questionService.getAvailableYears(courseId);
  }
  @Post('questions/create')
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return await this.questionService.createQuestion(createQuestionDto);
  }

  @Put('questions/:id')
  async updateQuestion(
    @Body() updateQuestionDto: UpdateQuestionDto,
    @Param('id') id: mongoose.Schema.Types.ObjectId,
  ) {
    return await this.questionService.updateQuestion(id, updateQuestionDto);
  }
  @Delete('questions/:id')
  async DeleteQuestion(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return await this.questionService.deleteQuestion(id);
  }
}
