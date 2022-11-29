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

@Controller()
export class DirectionController {
  constructor(private readonly directionService: DirectionService) {}

  @Get('directions')
  async getDirection(@Body() getDirectionDto: GetDirectionDto) {
    return await this.directionService.getDirections(getDirectionDto);
  }

  @Post('directions')
  async createQuestion(@Body() createDirectionDto: CreateDirectionDto) {
    return await this.directionService.createDirection(createDirectionDto);
  }

  @Put('directions/:id')
  async updateQuestion(
    @Body() updateQuestionDto: UpdateQuestionDto,
    @Param('id') id: number,
  ) {
    return await this.directionService.updateDirection(id, updateQuestionDto);
  }
  @Delete('directions/:id')
  async DeleteQuestion(@Param('id') id: number) {
    return await this.directionService.deleteDirection(id);
  }
}
