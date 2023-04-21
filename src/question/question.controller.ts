import { Public } from '@app/admin/decorators/publicRoute.decorators';
import { AdminGuard } from '@app/admin/guards/admin.guard';
import { ExpressRequest } from '@app/user/types/expressRequest.interface';
import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { GetQuestionDto } from './dto/getQuestion.dto';
import { UpdateQuestionDto } from './dto/updateQuestion.dto';
import { QuestionService } from './question.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

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
  @Post('questions/for-admin')
  @Public()
  async getQuestionsForAdmin(@Body() getQuestionDto: GetQuestionDto) {
    return await this.questionService.getPlainQuestionsForAdmin(getQuestionDto);
  }
  @Get('questions/free/:courseId')
  @Public()
  async getFreeQuestion(
    @Param('courseId') courseId: mongoose.Schema.Types.ObjectId,
  ) {
    return await this.questionService.getRandomQuestion(courseId);
  }

  @Get('questions/sample')
  @Public()
  async insertSample() {
    return await this.questionService.insertSample();
  }

  @Get('questions/courses/get-years/:id')
  async getAvailableYears(
    @Param('id') courseId: mongoose.Schema.Types.ObjectId,
  ) {
    return await this.questionService.getAvailableYears(courseId);
  }

  @Get('questions/courses/get-years/v2/:id')
  async getAvailableYearsV2(
    @Param('id') courseId: mongoose.Schema.Types.ObjectId,
  ) {
    return await this.questionService.getAvailableYearsV2(courseId);
  }
  @Get('questions/exam-data/:id')
  async getExamData(@Param('id') courseId: mongoose.Schema.Types.ObjectId) {
    return await this.questionService.getExamData(courseId);
  }

  @Post('questions/create')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'questionImage', maxCount: 1 },
      { name: 'descriptionImage', maxCount: 1 },
    ]),
  )
  async createQuestion(
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: false,
      }),
    )
    files: {
      questionImage?: Express.Multer.File[] | undefined;
      descriptionImage?: Express.Multer.File[] | undefined;
    },
    @Body() createQuestionDto: CreateQuestionDto,
    @Req() req: ExpressRequest,
  ) {
    const questionImage = files?.questionImage
      ? files?.questionImage[0].filename
      : null;
    const descriptionImage = files?.descriptionImage
      ? files?.descriptionImage[0].filename
      : null;

    console.log(questionImage + ' ' + descriptionImage);

    return await this.questionService.createQuestion(
      createQuestionDto,
      questionImage,
      descriptionImage,
      req.userId,
    );
  }

  @Post('questions/update/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'questionImage', maxCount: 1 },
      { name: 'descriptionImage', maxCount: 1 },
    ]),
  )
  async updateQuestion(
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: false,
      }),
    )
    files: {
      questionImage?: Express.Multer.File[] | undefined;
      descriptionImage?: Express.Multer.File[] | undefined;
    },
    @Body() updateQuestionDto: UpdateQuestionDto,
    @Param('id') id: mongoose.Schema.Types.ObjectId,
  ) {
    const questionImage = files?.questionImage
      ? files?.questionImage[0].filename
      : null;
    const descriptionImage = files?.descriptionImage
      ? files?.descriptionImage[0].filename
      : null;

    console.log(questionImage + ' ' + descriptionImage);
    console.log(JSON.stringify(updateQuestionDto));

    return await this.questionService.updateQuestion(
      id,
      updateQuestionDto,
      questionImage,
      descriptionImage,
    );
  }

  @Delete('questions/:id')
  async DeleteQuestion(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return await this.questionService.deleteQuestion(id);
  }
}
