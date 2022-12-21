import { GroupedQuestionService } from '@app/question/groupedQuestion.service';
import { QuestionService } from '@app/question/question.service';
import { GroupedQuestion } from '@app/question/schemas/groupedQuestion.schema';
import { Question } from '@app/question/schemas/question.schema';
import { responseBuilder } from '@app/utils/http-response-builder';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateProgressDto } from './dto/createProgress.dto';
import { GetProgressDto } from './dto/getProgress.dto';
import { SubmitAnswerDto } from './dto/submitAnswer.dto';
import { PagesService } from './pages.service';
import { Progress, ProgressDocument } from './schemas/progress.schema';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private progressModel: Model<ProgressDocument>,

    private readonly pagesService: PagesService,
    @Inject(forwardRef(() => QuestionService))
    private readonly questionService: QuestionService,
    @Inject(forwardRef(() => GroupedQuestionService))
    private readonly groupedQuestionService: GroupedQuestionService,
  ) {}
  async createNewProgress(createProgressDto: CreateProgressDto) {
    let newProgress = new this.progressModel();
    Object.assign(newProgress, createProgressDto);
    return await newProgress.save();
  }

  async submitAnswer(
    userId: mongoose.Schema.Types.ObjectId,
    submitAnswerDto: SubmitAnswerDto,
  ) {
    const courseId = submitAnswerDto.courseId;

    const year = submitAnswerDto.year;
    const submittedPage = submitAnswerDto.submittedPage;
    let page = await this.pagesService.findPage({
      courseId,
      userId,
      year,
      page: submittedPage,
    });
    if (!page) return 'page does not exist';
    if (page && page.isSubmitted) return 'all ready submitted';
    let correctAnswers = 0,
      wrongAnswers = 0,
      skippedQuestions = 0;
    for (let i = 0; i < submitAnswerDto.answers.length; i++) {
      let submittedAnswer = submitAnswerDto.answers[i];
      if (submittedAnswer.skipped) {
        skippedQuestions++;
        continue;
      }
      let question: Question | GroupedQuestion = null;
      if (submitAnswerDto.isGrouped) {
        question = await this.groupedQuestionService.getGroupedQuestionById(
          submittedAnswer.questionID,
        );
      } else {
        question = await this.questionService.getQuestionById(
          submittedAnswer.questionID,
        );
      }

      if (submittedAnswer.answer == question.answer) {
        correctAnswers++;
      } else {
        wrongAnswers++;
      }
      let progress = await this.progressModel.findOne({
        courseId,
        year,
        userId,
      });
      progress.correctAnswers += correctAnswers;
      progress.wrongAnswers += wrongAnswers;
      progress.skippedQuestions += skippedQuestions;
      progress.totalTime += Date.now() - page.startTime;
      progress.lastPage = submitAnswerDto.submittedPage;
      await progress.save();
      return responseBuilder({ statusCode: 200, body: progress });
    }
  }

  async getProgress(
    userId: mongoose.Schema.Types.ObjectId,
    { courseId, year }: GetProgressDto,
  ) {
    //TODO return default if its empty construct all data dynamically
    let progress = await this.progressModel.findOne({
      courseId,
      year,
      userId,
    });
    if (progress) {
      return responseBuilder({ statusCode: 200, body: progress });
    } else {
      const count = await this.questionService.getCourseQuestionCount({
        courseId,
        year,
      });
      const progress = {
        correctAnswers: 0,
        wrongAnswers: 0,
        skippedQuestions: 0,
        totalTime: 0,
        lastPage: 1,
        totalQuestions: count,
      };
      return responseBuilder({ statusCode: 200, body: progress });
    }
  }
}
