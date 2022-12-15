import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateGroupedQuestionDto } from './dto/createGroupedQuestion.dto';
import { GetGroupedQuestionDto } from './dto/getGroupedQuestion.dto';
import { UpdateGroupedQuestionDto } from './dto/updateGroupedQuestion.dto';
import { GroupedQuestionService } from './groupedQuestion.service';

@Controller()
export class GroupedQuestionController {
  constructor(
    private readonly groupedQuestionService: GroupedQuestionService,
  ) {}

  @Post('grouped-questions')
  async getGroupedQuestion(
    @Body() getGroupedQuestionDto: GetGroupedQuestionDto,
  ) {
    return await this.groupedQuestionService.getGroupedQuestion(
      getGroupedQuestionDto,
    );
  }

  @Post('grouped-questions/create')
  async createGroupedQuestion(
    @Body() createGroupedQuestionDto: CreateGroupedQuestionDto,
  ) {
    return await this.groupedQuestionService.createGroupedQuestion(
      createGroupedQuestionDto,
    );
  }

  @Put('grouped-questions/:id')
  async updateGroupedQuestion(
    @Body() updateGroupedQuestionDto: UpdateGroupedQuestionDto,
    @Param('id') id: number,
  ) {
    return await this.groupedQuestionService.updateGroupedQuestion(
      id,
      updateGroupedQuestionDto,
    );
  }
  @Delete('grouped-questions/:id')
  async DeleteGroupedQuestion(@Param('id') id: number) {
    return await this.groupedQuestionService.deleteGroupedQuestion(id);
  }
}
