import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  UserChallenge,
  UserChallengeDocument,
} from './schemas/user-challenge.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  AdminChallenge,
  AdminChallengeDocument,
} from './schemas/admin-challenge.schema';
import { QuestionInfo } from '@app/challenge/dto/createChallenge.dto';
import { QuestionService } from '@app/question/question.service';

@Injectable()
export class UserChallengeService {
  constructor(
    @InjectModel(UserChallenge.name)
    private userChallengeModel: Model<UserChallengeDocument>,
    @InjectModel(AdminChallenge.name)
    private adminChallengeModel: Model<AdminChallengeDocument>,
    private questionService: QuestionService,
  ) {}

  async getLevelChallenge(
    level: number,
    userId: any,
    courseId: any,
  ): Promise<any> {
    let questions = [];
    const challengeExist = await this.adminChallengeModel.findOne({
      level: level,
      isActive: true,
    });

    if (!challengeExist) throw new NotFoundException();

    const unAssignedUser = await this.userChallengeModel.findOne({
      opponentAssigned: false,
    });

    const challengeAlreadySubmitted = await this.userChallengeModel.findOne({
      userId,
      level,
      isActive: true,
      challengeSubmitted: true,
    });

    if (challengeAlreadySubmitted) {
      throw new HttpException(
        'Challenge Already submitted',
        HttpStatus.CONFLICT,
      );
    }

    const newUserChallenge = new this.userChallengeModel({
      adminChallenge: challengeExist._id,
      userId,
    });

    if (unAssignedUser) {
      unAssignedUser.opponentId = userId;
      unAssignedUser.opponentAssigned = true;
      await unAssignedUser.save();

      newUserChallenge.opponentAssigned = true;
      newUserChallenge.opponentId = unAssignedUser._id as any;
      newUserChallenge.questions = unAssignedUser.questions;
      for (const question of unAssignedUser.questions) {
        const q = await this.questionService.getQuestionById(question.id);
        questions.push(q);
      }
    } else {
      // generate questions - - - - - - - - -
      const questionsInfo: QuestionInfo[] = [];

      const randomQuestions = await this.questionService.getRandomQuestion(
        courseId,
        10,
      );

      questions = randomQuestions;
      for (const question of randomQuestions) {
        questionsInfo.push({ id: question._id, answer: question.answer });
      }

      newUserChallenge.questions = questionsInfo;
    }
    await newUserChallenge.save();

    return { data: questions, status: 'success', message: '' };
  }
}
