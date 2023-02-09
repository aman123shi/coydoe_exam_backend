import { ExpressRequest } from '@app/user/types/expressRequest.interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { CreateGroupedQuestionDto } from './dto/createGroupedQuestion.dto';
import { GetGroupedQuestionDto } from './dto/getGroupedQuestion.dto';
import { UpdateGroupedQuestionDto } from './dto/updateGroupedQuestion.dto';
import { GroupedQuestionService } from './groupedQuestion.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller()
export class GroupedQuestionController {
  constructor(
    private readonly groupedQuestionService: GroupedQuestionService,
  ) {}

  @Post('grouped-questions')
  async getGroupedQuestion(
    @Body() getGroupedQuestionDto: GetGroupedQuestionDto,
    @Req() req: ExpressRequest,
  ) {
    return await this.groupedQuestionService.getGroupedQuestion(
      getGroupedQuestionDto,
      req.userId,
    );
  }

  @Post('grouped-questions/create')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'questionImage', maxCount: 1 },
      { name: 'descriptionImage', maxCount: 1 },
    ]),
  )
  async createGroupedQuestion(
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: false,
      }),
    )
    files: {
      questionImage?: Express.Multer.File[] | undefined;
      descriptionImage?: Express.Multer.File[] | undefined;
    },
    @Body() createGroupedQuestionDto: CreateGroupedQuestionDto,
  ) {
    const questionImage = files?.questionImage
      ? files?.questionImage[0].filename
      : null;
    const descriptionImage = files?.descriptionImage
      ? files?.descriptionImage[0].filename
      : null;
    return await this.groupedQuestionService.createGroupedQuestion(
      createGroupedQuestionDto,
      questionImage,
      descriptionImage,
    );
  }

  @Put('grouped-questions/:id')
  async updateGroupedQuestion(
    @Body() updateGroupedQuestionDto: UpdateGroupedQuestionDto,
    @Param('id') id: mongoose.Schema.Types.ObjectId,
  ) {
    return await this.groupedQuestionService.updateGroupedQuestion(
      id,
      updateGroupedQuestionDto,
    );
  }
  @Delete('grouped-questions/:id')
  async DeleteGroupedQuestion(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return await this.groupedQuestionService.deleteGroupedQuestion(id);
  }
}
