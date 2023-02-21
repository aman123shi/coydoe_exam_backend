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

@Injectable()
export class DataClerkService {
  constructor(
    @InjectModel(DataClerk.name)
    private dataClerkModel: Model<DataClerkDocument>,
    @Inject(forwardRef(() => QuestionService))
    private questionService: QuestionService,

    @Inject(forwardRef(() => GroupedQuestionService))
    private groupedQuestionService: GroupedQuestionService,
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
}
