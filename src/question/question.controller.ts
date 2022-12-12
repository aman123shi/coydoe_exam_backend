import { Public } from '@app/admin/decorators/publicRoute.decorators';
import { AdminGuard } from '@app/admin/guards/admin.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { GetQuestionDto } from './dto/getQuestion.dto';
import { UpdateQuestionDto } from './dto/updateQuestion.dto';
import { QuestionService } from './question.service';

@Controller()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('questions')
  @Public()
  async getQuestion(@Body() getQuestionDto: GetQuestionDto) {
    return await this.questionService.getQuestion(getQuestionDto);
  }
  @Get('questions/free')
  @Public()
  async getFreeQuestion(@Body() getQuestionDto: GetQuestionDto) {
    return await this.questionService.getRandomQuestion(getQuestionDto);
  }

  @Post('questions')
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return await this.questionService.createQuestion(createQuestionDto);
  }

  @Put('questions/:id')
  async updateQuestion(
    @Body() updateQuestionDto: UpdateQuestionDto,
    @Param('id') id: number,
  ) {
    return await this.questionService.updateQuestion(id, updateQuestionDto);
  }
  @Delete('questions/:id')
  async DeleteQuestion(@Param('id') id: number) {
    return await this.questionService.deleteQuestion(id);
  }
}
