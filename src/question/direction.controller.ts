import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DirectionService } from '@app/question/direction.service';
import { CreateDirectionDto } from '@app/question/dto/createDirection.dto';
import { GetDirectionDto } from '@app/question/dto/getDirection.dto';
import { UpdateQuestionDto } from '@app/question/dto/updateQuestion.dto';
import mongoose from 'mongoose';

@Controller()
export class DirectionController {
  constructor(private readonly directionService: DirectionService) {}

  //returns distinct  available direction  years of particular course
  @Get('/directions/get/years/:courseId')
  async getAvailableYearsForCourse(
    @Param('courseId') courseId: mongoose.Schema.Types.ObjectId,
  ) {
    return await this.directionService.getYearsOfAvailableDirection(courseId);
  }

  @Post('directions')
  async getDirection(@Body() getDirectionDto: GetDirectionDto) {
    return await this.directionService.getDirections(getDirectionDto);
  }

  @Post('directions/create')
  async createQuestion(@Body() createDirectionDto: CreateDirectionDto) {
    return await this.directionService.createDirection(createDirectionDto);
  }

  @Put('directions/:id')
  async updateQuestion(
    @Body() updateQuestionDto: UpdateQuestionDto,
    @Param('id') id: mongoose.Schema.Types.ObjectId,
  ) {
    return await this.directionService.updateDirection(id, updateQuestionDto);
  }
  @Delete('directions/:id')
  async DeleteQuestion(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return await this.directionService.deleteDirection(id);
  }
}
