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
  @Post('grouped-questions/for-admin')
  async getGroupedQuestionsForAdmin(
    @Body() getGroupedQuestionDto: GetGroupedQuestionDto,
    @Req() req: ExpressRequest,
  ) {
    return await this.groupedQuestionService.getGroupedQuestionForAdmin(
      getGroupedQuestionDto,
    );
  }
  @Post('grouped-questions/v2')
  async getGroupedQuestionsV2(
    @Body() getGroupedQuestionDto: GetGroupedQuestionDto,
  ) {
    return await this.groupedQuestionService.getGroupedQuestionsV2(
      getGroupedQuestionDto,
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
    @Req() req: ExpressRequest,
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
      req.userId,
    );
  }

  @Put('grouped-questions/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'questionImage', maxCount: 1 },
      { name: 'descriptionImage', maxCount: 1 },
    ]),
  )
  async updateGroupedQuestion(
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: false,
      }),
    )
    files: {
      questionImage?: Express.Multer.File[] | undefined;
      descriptionImage?: Express.Multer.File[] | undefined;
    },
    @Body() updateGroupedQuestionDto: UpdateGroupedQuestionDto,
    @Param('id') id: mongoose.Schema.Types.ObjectId,
  ) {
    const questionImage = files?.questionImage
      ? files?.questionImage[0].filename
      : null;
    const descriptionImage = files?.descriptionImage
      ? files?.descriptionImage[0].filename
      : null;
    return await this.groupedQuestionService.updateGroupedQuestion(
      id,
      updateGroupedQuestionDto,
      questionImage,
      descriptionImage,
    );
  }

  @Delete('grouped-questions/:id')
  async DeleteGroupedQuestion(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return await this.groupedQuestionService.deleteGroupedQuestion(id);
  }
}
