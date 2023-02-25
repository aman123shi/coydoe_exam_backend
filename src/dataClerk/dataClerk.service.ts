import {
  Inject,
  Injectable,
  UnprocessableEntityException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DataClerk, DataClerkDocument } from './schemas/dataClerk.schema';
import mongoose, { Model } from 'mongoose';
import { CreateDataClerkDTO } from './dtos/CreateDataClerkDTO';
import { sign, verify } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';
import { LoginDataClerkDTO } from './dtos/loginDataClerkDto';
import { QuestionService } from '@app/question/question.service';
import { GroupedQuestionService } from '@app/question/groupedQuestion.service';
import {
  ClerkDataEntryReport,
  ClerkDataEntryReportDocument,
} from './schemas/dataEntry.schema';
import { ClerkDataEntryReportDTO } from './dtos/createClerkDataEntry.dto';
import { endOfDay, startOfDay, subDays } from 'date-fns';
import { CourseService } from '@app/course/course.service';

@Injectable()
export class DataClerkService {
  constructor(
    @InjectModel(DataClerk.name)
    private dataClerkModel: Model<DataClerkDocument>,
    @InjectModel(ClerkDataEntryReport.name)
    private clerkDataEntryReportModel: Model<ClerkDataEntryReportDocument>,
    @Inject(forwardRef(() => QuestionService))
    private questionService: QuestionService,

    @Inject(forwardRef(() => GroupedQuestionService))
    private groupedQuestionService: GroupedQuestionService,

    private courseService: CourseService,
  ) {}
  generateJWT(data: any): string {
    return sign(data, JWT_SECRET);
  }

  verifyJWT(token: string) {
    return verify(token, JWT_SECRET);
  }
  async createAccount(createDataClerkDto: CreateDataClerkDTO) {
    try {
      const isPublicAuthenticated = this.verifyJWT(
        createDataClerkDto.token || '',
      );
      if (!isPublicAuthenticated) {
        throw new UnprocessableEntityException(
          'first AUth The Public then Try Again',
        );
      }
      let userExist = await this.dataClerkModel.findOne({
        username: createDataClerkDto.username,
      });
      if (userExist) {
        throw new UnprocessableEntityException(
          'Username Taken please choose new',
        );
      }
      let newClerk = new this.dataClerkModel();
      Object.assign(newClerk, createDataClerkDto);
      await newClerk.save();
      return {
        fullName: createDataClerkDto.fullName,
        username: createDataClerkDto.username,
        token: this.generateJWT({ id: newClerk._id }),
      };
    } catch (error) {
      throw new UnprocessableEntityException(
        'first AUth The Public then Try Again',
      );
    }
  }

  async login(loginClerkDto: LoginDataClerkDTO) {
    try {
      const isPublicAuthenticated = this.verifyJWT(loginClerkDto.token || '');
      if (!isPublicAuthenticated) {
        throw new UnprocessableEntityException(
          'first AUth The Public then Try Again',
        );
      }
      let userExist = await this.dataClerkModel.findOne({
        username: loginClerkDto.username,
      });
      if (!userExist) {
        throw new UnprocessableEntityException(
          'Username or password Incorrect please Try Again',
        );
      }
      if (userExist.password !== loginClerkDto.password) {
        throw new UnprocessableEntityException(
          'Username or password Incorrect please Try Again',
        );
      }
      return {
        username: userExist.username,
        token: this.generateJWT({ id: userExist._id }),
      };
    } catch (error) {
      throw new UnprocessableEntityException(
        'first AUth The Public then Try Again',
      );
    }
  }
  async getClerk(userId: mongoose.Schema.Types.ObjectId) {
    return await this.dataClerkModel.findById(userId);
  }
  async incrementQuestionEntered(
    userId: mongoose.Schema.Types.ObjectId,
  ): Promise<any> {
    return await this.dataClerkModel.updateOne(
      { _id: userId },
      { $inc: { questionsEntered: 1 } },
    );
  }

  async publicClerkLogin(loginDto: LoginDataClerkDTO) {
    if (
      loginDto.username == 'coydoeDataEncoder' &&
      loginDto.password == 'coydoe123'
    ) {
      return {
        token: this.generateJWT({ id: 'publicUserId' }),
      };
    } else {
      throw new UnprocessableEntityException(
        'Please Provide  correct Credentials',
      );
    }
  }

  async getClerkAndSystemInfo() {
    let clerks = await this.dataClerkModel.find().select('-password');
    let plainQuestionsCount =
      await this.questionService.getPlainQuestionsCount();
    let groupedQuestionsCount =
      await this.groupedQuestionService.getGroupedQuestionsCount();
    return {
      clerks,
      totalData: plainQuestionsCount + groupedQuestionsCount,
    };
  }

  async insertReport(createClerkDataEntryDto: ClerkDataEntryReportDTO) {
    let insertedReport = await this.clerkDataEntryReportModel.findOneAndUpdate(
      {
        clerkId: createClerkDataEntryDto.clerkId,
        courseId: createClerkDataEntryDto.courseId,
        createdAt: {
          $gte: startOfDay(new Date()),
          $lte: endOfDay(new Date()),
        },
      },
      {
        clerkId: createClerkDataEntryDto.clerkId,
        courseId: createClerkDataEntryDto.courseId,
        $inc: { count: 1 },
      },
      { upsert: true },
    );

    return insertedReport;
  }

  async generateDataInsertionReport(
    clerkId: any,
    dateDuration: number,
  ): Promise<any[]> {
    let courses: any = {},
      response = [];
    let matchCriteria: any = {
      clerkId: new mongoose.Types.ObjectId(clerkId),
      createdAt: {
        $gte: startOfDay(subDays(new Date(), dateDuration)),
      },
    };

    const dataInsertionReports = await this.clerkDataEntryReportModel.find(
      matchCriteria,
    );

    //group by courseId as a key and count and store that date insertion
    for (const insertion of dataInsertionReports) {
      if (!courses[insertion.courseId.toString()]) {
        courses[insertion.courseId.toString()] = [
          { createdAt: insertion?.createdAt, count: insertion.count },
        ];
      } else {
        courses[insertion.courseId.toString()].push({
          createdAt: insertion?.createdAt,
          count: insertion.count,
        });
      }
    }
    //iterate to get course name and reformat the response
    for (const key in courses) {
      const courseId = new mongoose.Types.ObjectId(key);
      let course = await this.courseService.getCourseById(courseId);
      response.push({ name: course.name, insertions: courses[key] });
    }
    return response;
  }
  async generateAllTimeInsertionReport(clrkId: string) {
    let courses: any = {},
      response = [];
    const clerkId = new mongoose.Types.ObjectId(clrkId);
    const dataInsertionReports = await this.clerkDataEntryReportModel.aggregate(
      [
        { $match: { clerkId } },
        { $group: { _id: '$courseId', total: { $sum: '$count' } } },
      ],
    );
    for (const insertion of dataInsertionReports) {
      const courseId = new mongoose.Types.ObjectId(insertion._id);
      let course = await this.courseService.getCourseById(courseId);
      response.push({ name: course.name, count: insertion.total });
    }
    return response;
  }
  async insertDummyReport() {
    let newInsertion = new this.clerkDataEntryReportModel();
    Object.assign(newInsertion, {
      clerkId: '63f09552e64c513045f245ac',
      courseId: '63e49566acbfccb4849b659c',
      count: 7,
    });
    return await newInsertion.save();
  }
}
