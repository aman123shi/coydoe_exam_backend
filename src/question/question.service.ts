import { CourseService } from '@app/course/course.service';
import { PagesService } from '@app/progress/pages.service';
import { ProgressService } from '@app/progress/progress.service';
import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { GetQuestionDto } from './dto/getQuestion.dto';
import { UpdateQuestionDto } from './dto/updateQuestion.dto';
import { GroupedQuestionService } from './groupedQuestion.service';
import { Question, QuestionDocument } from './schemas/question.schema';
import { QuestionsWithCount } from './types/questionsWithCount';
import { DataClerkService } from '@app/dataClerk/dataClerk.service';
import { AdminService } from '@app/admin/admin.service';
import { DirectionService } from './direction.service';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name)
    private questionModel: Model<QuestionDocument>,
    private readonly courseService: CourseService,

    @Inject(forwardRef(() => PagesService))
    private readonly pagesService: PagesService,
    @Inject(forwardRef(() => ProgressService))
    private readonly progressService: ProgressService,
    @Inject(forwardRef(() => GroupedQuestionService))
    private readonly groupedQuestionService: GroupedQuestionService,
    @Inject(forwardRef(() => DataClerkService))
    private readonly dataClerkService: DataClerkService,
    private readonly adminService: AdminService,
    @Inject(forwardRef(() => DirectionService))
    private readonly directionService: DirectionService,
  ) {}

  async getQuestionById(id: mongoose.Schema.Types.ObjectId) {
    const question = await this.questionModel.findOne({ _id: id });
    return question;
  }

  async getQuestion(
    getQuestionDto: GetQuestionDto,
    userId: mongoose.Schema.Types.ObjectId,
  ): Promise<QuestionsWithCount> {
    const limit = getQuestionDto.limit || 5;
    const page = getQuestionDto.page || 1;
    const course = getQuestionDto.course;
    const year = getQuestionDto.year;
    const subExamCategory = getQuestionDto.subCategory;
    const visitedPage = await this.pagesService.findPage({
      courseId: course,
      year,
      userId,
      page,
    });

    const skip = (page - 1) * limit;
    const aggregationPipeline = [
      {
        $match: {
          year: year,
          course: course,
          subExamCategory,
        },
      },
    ];
    const questions = await this.questionModel
      .aggregate(aggregationPipeline)
      .sort({ questionNumber: 1 })
      .skip(skip)
      .limit(limit);
    const count = await this.questionModel.count({
      course,
      year,
      subExamCategory,
    });
    if (!visitedPage) {
      await this.pagesService.createNewPage({
        courseId: course,
        year,
        userId,
        page,
        pageSize: limit,
        isSubmitted: false,
        startTime: Date.now(),
      });
      if (page === 1)
        await this.progressService.createNewProgress({
          courseId: course,
          year,
          userId,
          totalQuestions: count,
          lastPage: page,
        });
    }
    return { questions, count };
  }

  async createQuestion(
    createQuestionDto: CreateQuestionDto,
    questionImage: string | null,
    descriptionImage: string | null,
    userId: mongoose.Schema.Types.ObjectId | undefined,
  ) {
    const newQuestion = new this.questionModel();
    Object.assign(newQuestion, createQuestionDto);

    if (questionImage) newQuestion.questionImage = questionImage;
    if (descriptionImage) newQuestion.descriptionImage = descriptionImage;
    //check if this question is already inserted
    const questionExisted = await this.questionModel.findOne({
      course: createQuestionDto.course,
      year: createQuestionDto.year,
      questionNumber: createQuestionDto.questionNumber,
    });
    if (questionExisted) {
      throw new UnprocessableEntityException('Question already Existed');
    }
    const question = await newQuestion.save();
    //increment EnteredQuestion for that clerk
    await this.dataClerkService.incrementQuestionEntered(userId);
    //insert data entry report for that day from dataClerkService(insert report)
    await this.dataClerkService.insertReport({
      clerkId: userId,
      courseId: createQuestionDto.course,
    });
    //increment admin notification for that user AdminService
    await this.adminService.incrementDataInsertionNotification(userId);
    return question;
  }
  async insertSample() {
    for (const q of 'physics') {
      const newQuestion = new this.questionModel();
      // this.questionModel.insertMany()
      Object.assign(newQuestion, q);
      await newQuestion.save();
    }
    return 'boom';
  }

  async getCourseQuestionCount({
    courseId,
    year,
  }: {
    courseId: mongoose.Schema.Types.ObjectId;
    year: number;
  }) {
    return await this.questionModel.count({ course: courseId, year });
  }

  async getAvailableYears(courseId: mongoose.Schema.Types.ObjectId) {
    if (!mongoose.isValidObjectId(courseId)) {
      throw new HttpException(
        'invalid Course ID ',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const course = await this.courseService.getCourseById(courseId);
    if (!course) {
      throw new HttpException(
        'invalid Course ID ',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    try {
      let years = [];
      if (course.hasDirections == false)
        years = await this.questionModel
          .find({ course: courseId })
          .select('year')
          .distinct('year');
      else {
        years = await this.groupedQuestionService.getYearsOfGroupedQuestions(
          courseId,
        );
      }
      console.log(years);
      return years.map((year) => ({ year: year }));
    } catch (error) {
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async getExamData(courseId: mongoose.Schema.Types.ObjectId) {
    const examData = [];
    const years = (await this.getAvailableYearsV2(courseId)).years;
    if (years.length == 0) {
      return { examData: [] };
    }

    for (const year of years) {
      let parts = await this.getGroupedQuestionsExamParts(courseId, year);
      const totalQuestions = await this.getTotalQuestions(courseId, year);
      if (parts == 0) parts += 1; //for non grouped subjects
      examData.push({ year, totalQuestions, parts });
    }
    return { examData };
  }

  async getGroupedQuestionsExamParts(
    courseId: mongoose.Schema.Types.ObjectId,
    year: number,
  ) {
    return await this.directionService.getDirectionsCount({ courseId, year });
  }

  async getTotalQuestions(
    courseId: mongoose.Schema.Types.ObjectId,
    year: number,
  ) {
    let totalQuestions = 0;

    const course = await this.courseService.getCourseById(courseId);
    if (!course) return 0;
    if (course.hasDirections == false) {
      totalQuestions = await this.questionModel
        .find({ course: courseId, year })
        .count();
    } else {
      totalQuestions = await this.groupedQuestionService.getTotalQuestions(
        courseId,
        year,
      );
    }
    return totalQuestions;
  }

  async getAvailableYearsV2(courseId: mongoose.Schema.Types.ObjectId) {
    const result = await this.getAvailableYears(courseId);
    if (result.length == 0) {
      return { years: [] };
    }
    return {
      years: result.map((y) => y.year),
    };
  }

  async updateQuestion(
    id: mongoose.Schema.Types.ObjectId,
    updateQuestionDto: UpdateQuestionDto,
    descriptionImage: string | null,
    questionImage: string | null,
  ): Promise<any> {
    if (questionImage) updateQuestionDto.questionImage = questionImage;
    if (descriptionImage) updateQuestionDto.descriptionImage = descriptionImage;
    return await this.questionModel.updateOne({ _id: id }, updateQuestionDto);
  }

  async deleteQuestion(id: mongoose.Schema.Types.ObjectId): Promise<any> {
    return await this.questionModel.deleteOne({ _id: id });
  }

  async getRandomQuestion(
    courseId: mongoose.Schema.Types.ObjectId,
    limit = 10,
  ) {
    const count = await this.questionModel.find({ course: courseId }).count();
    const questions = [];
    for (let i = 0; i < limit; i++) {
      let randomSkip = Math.floor(Math.random() * count);
      if (randomSkip == count) randomSkip -= 1; //subtract one if it reaches limit

      if (randomSkip < 0) randomSkip = 0;
      const question = await this.questionModel
        .findOne({ course: courseId })
        .skip(randomSkip);
      questions.push(question);
    }

    return questions;
  }

  async getPlainQuestionsForAdmin(getQuestionDto: GetQuestionDto) {
    const course = getQuestionDto.course;
    const year = getQuestionDto.year;
    const page = getQuestionDto.page || 1;
    const limit = getQuestionDto.limit || 10;
    const skip = (page - 1) * limit;

    const questions = await this.questionModel
      .find({ course, year })
      .sort({ questionNumber: 1 })
      .skip(skip)
      .limit(limit);

    const count = await this.questionModel.count({
      course,
      year,
    });

    return { questions, count };
  }
  async getPlainQuestionsCount() {
    const count = await this.questionModel.find().count();
    return count;
  }

  async getRandomPlainQuestions(courseId: mongoose.Schema.Types.ObjectId) {
    // const questions = await this.questionModel
    //   .aggregate([{ $match: { course: courseId } }, { $sample: { size: 10 } }])
    //   .exec();
    const questions = await this.getRandomQuestion(courseId);
    const count = await this.questionModel.count({
      course: courseId,
    });

    return { questions, total: count };
  }
}
