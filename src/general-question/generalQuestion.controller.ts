import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { GeneralQuestionService } from './generalQuestion.service';
import { GetGeneralQuestionDto } from './dto/getGeneralQuestion.dto';
import { CreateGeneralQuestionDto } from './dto/createGeneralQuestion.dto';
import mongoose from 'mongoose';
import { UpdateGeneralQuestionDto } from './dto/updateGeneralQuestion.dto';
import { ExpressRequest } from '@app/user/types/expressRequest.interface';

@Controller('general-questions')
export class GeneralQuestionController {
  constructor(
    private readonly generalQuestionService: GeneralQuestionService,
  ) {}

  @Get()
  async getGeneralQuestions(@Query() query: GetGeneralQuestionDto) {
    const page = parseInt(query?.page?.toString() || '1');
    const limit = parseInt(query?.limit?.toString() || '10');
    return await this.generalQuestionService.getGeneralQuestions(page, limit);
  }

  @Get('random')
  async getRandomGeneralQuestions() {
    return await this.generalQuestionService.getRandomGeneralQuestions();
  }

  @Post()
  async createGeneralQuestion(
    @Body() createGeneralQuestionDto: CreateGeneralQuestionDto,
    @Req() req: ExpressRequest,
  ) {
    return await this.generalQuestionService.createGeneralQuestions(
      createGeneralQuestionDto,
      req.userId,
    );
  }

  @Put('/:id')
  async updateGeneralQuestion(
    @Param('id') id: mongoose.Schema.Types.ObjectId,
    @Body() updateGeneralQuestionDto: UpdateGeneralQuestionDto,
  ) {
    return await this.generalQuestionService.updateGeneralQuestion(
      id,
      updateGeneralQuestionDto,
    );
  }

  @Delete('/:id')
  async deleteGeneralQuestion(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return await this.generalQuestionService.deleteGeneralQuestion(id);
  }
}
