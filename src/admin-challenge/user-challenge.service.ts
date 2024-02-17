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
import { CreateUserChallengeDTO } from './dtos/createUserChallenge.dto';
import { SubmitUserChallengeDto } from './dtos/submitUserChallenge.dto';
import { UserService } from '@app/user/user.service';

@Injectable()
export class UserChallengeService {
  constructor(
    @InjectModel(UserChallenge.name)
    private userChallengeModel: Model<UserChallengeDocument>,
    @InjectModel(AdminChallenge.name)
    private adminChallengeModel: Model<AdminChallengeDocument>,
    private questionService: QuestionService,
    private userService: UserService,
  ) {}

  async getLevelChallenge(
    userId: any,
    createUserChallengeDTO: CreateUserChallengeDTO,
  ): Promise<any> {
    let questions = [];
    const challengeExist = await this.adminChallengeModel.findOne({
      level: createUserChallengeDTO.level,
      isActive: true,
    });

    if (!challengeExist) throw new NotFoundException();

    /*

    const user = await this.userService.getUserById(userId);
    if (
      !(
        user?.eligibleForLevel &&
        user?.eligibleForLevel >= createUserChallengeDTO.level
      )
    )
      throw new NotFoundException();

      */

    const unAssignedUser = await this.userChallengeModel.findOne({
      opponentAssigned: false,
    });

    const challengeCreated = await this.userChallengeModel.findOne({
      userId,
      level: createUserChallengeDTO.level,
      isActive: true,
    });

    if (challengeCreated && challengeCreated.challengeSubmitted) {
      throw new HttpException(
        'Challenge Already submitted',
        HttpStatus.CONFLICT,
      );
    } else if (challengeCreated) {
      for (const question of challengeCreated.questions) {
        const q = await this.questionService.getQuestionById(question.id);
        questions.push(q);
      }
    } else {
      // new user which has no previous challenge
      const newUserChallenge = new this.userChallengeModel({
        adminChallenge: challengeExist._id,
        userId,
        level: createUserChallengeDTO.level,
      });

      if (unAssignedUser) {
        unAssignedUser.opponentId = userId;
        unAssignedUser.opponentAssigned = true;
        await unAssignedUser.save();

        newUserChallenge.opponentAssigned = true;
        newUserChallenge.opponentId = unAssignedUser.userId as any;
        newUserChallenge.questions = unAssignedUser.questions;
        for (const question of unAssignedUser.questions) {
          const q = await this.questionService.getQuestionById(question.id);
          questions.push(q);
        }
      } else {
        const questionsInfo: QuestionInfo[] = [];

        const randomQuestions = await this.questionService.getRandomQuestion(
          createUserChallengeDTO.courseId,
          10,
        );
        console.log(randomQuestions);
        questions = randomQuestions;
        for (const question of randomQuestions) {
          questionsInfo.push({ id: question._id, answer: question.answer });
        }

        newUserChallenge.questions = questionsInfo;
      }
      await newUserChallenge.save();
    }

    return { data: questions, status: 'success', message: '' };
  }

  async submitChallengeQuestion(
    userId: any,
    submitUserChallengeDto: SubmitUserChallengeDto,
  ) {
    let userPoint = 0;
    const challengeCreated = await this.userChallengeModel.findOne({
      userId,
      level: submitUserChallengeDto.level,
      isActive: true,
    });

    if (challengeCreated && challengeCreated.challengeSubmitted) {
      throw new HttpException(
        'Challenge Already submitted',
        HttpStatus.CONFLICT,
      );
    }

    for (const q of submitUserChallengeDto.questionsInfo) {
      const currentQuestion = challengeCreated.questions.find(
        (item) => item.id == q.id,
      );
      if (currentQuestion?.answer == q?.answer) userPoint++;
    }
    challengeCreated.point = userPoint;
    challengeCreated.challengeSubmitted = true;

    await challengeCreated.save();

    return { data: challengeCreated };
  }

  async getPlayingUsers(level: number) {
    const challengeCreated = await this.userChallengeModel
      .find({
        level,
        opponentAssigned: true,
        isActive: true,
      })
      .populate('userId opponentId');

    const uniquePairs = [];
    const encounteredUsers = new Set();

    challengeCreated.forEach((challenge) => {
      const userId = challenge.userId as any;
      const opponentId = challenge.opponentId as any;
      console.log(challenge);
      const user = userId?.username;
      const opponent = opponentId?.username;

      if (
        !(
          encounteredUsers.has(userId._id.toString()) ||
          encounteredUsers.has(opponentId._id.toString())
        )
      ) {
        uniquePairs.push({ user, opponent });
        encounteredUsers.add(userId._id.toString());
        encounteredUsers.add(opponentId._id.toString());
      }
    });

    return { data: uniquePairs };
  }

  async getChallengeTopPlayers({
    limit,
    adminChallengeId,
  }: {
    limit: number;
    adminChallengeId: any;
  }) {
    const topUsers = await this.userChallengeModel
      .find({
        adminChallenge: adminChallengeId,
      })
      .sort({ point: -1, createdAt: 1 })
      .limit(limit);

    if (topUsers.length == 1) return topUsers;
    else if (topUsers.length % 2 !== 0) {
      //remove the last user if total players are not even
      topUsers.pop();
    }

    return topUsers;
  }

  async getChallengeUserByUserId(userId: any) {
    const challengeCreated = await this.userChallengeModel
      .findOne({
        userId,
      })
      .populate('userId');

    return challengeCreated;
  }
}
