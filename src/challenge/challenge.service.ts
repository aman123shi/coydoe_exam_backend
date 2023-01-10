import { NotificationGateway } from '@app/notification/notification.gateway';
import { NotificationService } from '@app/notification/notification.service';
import { QuestionService } from '@app/question/question.service';
import { UserService } from '@app/user/user.service';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateChallengeDto, QuestionInfo } from './dto/createChallenge.dto';
import { UpdateChallengeDto } from './dto/updateChallenge.dto';
import { Challenge, ChallengeDocument } from './schema/challenge.schema';
import { SubmitChallenge } from './types/submitChallenge.type';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel(Challenge.name)
    private challengeModel: Model<ChallengeDocument>,
    private questionService: QuestionService,
    private notificationService: NotificationService,
    private userService: UserService,
    private readonly notificationGateway: NotificationGateway,
  ) {}
  async createChallenge({ courseId, userId, opponentId }) {
    let newChallenge = new this.challengeModel();
    // Object.assign(newChallenge, createChallengeDto);
    let questionsInfo: QuestionInfo[] = [];
    const rewardPoint = 15;
    let randomQuestions = await this.questionService.getRandomQuestion(
      courseId,
    );
    for (const question of randomQuestions) {
      questionsInfo.push({ id: question._id, answer: question.answer });
    }
    newChallenge.questions = questionsInfo;
    newChallenge.opponent = opponentId;
    newChallenge.createdBy = userId;
    newChallenge.courseId = courseId;
    newChallenge.assignedPoint = rewardPoint;
    newChallenge.hasGroupedQuestions = false;
    await newChallenge.save();

    //notification for challenger  user
    await this.notificationService.createNotification({
      userId,
      message: 'waiting for opponent to complete the challenge',
      referenceId: newChallenge._id,
      notificationType: 'challenge',
      isViewed: false,
    });
    //notification for opponent user
    await this.notificationService.createNotification({
      userId,
      message: 'user x is challenging you to solve biology',
      referenceId: newChallenge._id,
      notificationType: 'challenge',
      isViewed: false,
    });

    return { challengeId: newChallenge._id, randomQuestions, rewardPoint };
  }

  async getChallengeById(id: mongoose.Schema.Types.ObjectId) {
    return await this.challengeModel.findById(id);
  }
  async getChallengeQuestions(challengeId: mongoose.Schema.Types.ObjectId) {}
  async updateChallenge(
    id: mongoose.Schema.Types.ObjectId,
    updateChallengeDto: UpdateChallengeDto,
  ) {
    let updatedChallenge = await this.challengeModel.findOneAndUpdate(
      { _id: id },
      updateChallengeDto,
    );
    return updatedChallenge;
  }

  async submitChallenge({
    challengeId,
    userId,
    questionsInfo,
  }: SubmitChallenge) {
    //:TODO
    //on submit identify if the submitter is a challenger or opponent
    // calculate answered questions and assign its score
    //identify if the other side already submitted
    //if submitted identify the winner and award the point to the winner
    //then create notification for both side and push
    //*else* if not submitted by other side calculate answered question and update user score,submittedByChallenger or Challenger
    let challenge = await this.challengeModel.findById(challengeId);

    let isChallenger = false,
      submitterScore = 0,
      challengerReward = 0,
      opponentReward = 0;
    if (!challenge) {
      throw new UnprocessableEntityException("can't find specified Challenge");
    }
    if (challenge.createdBy == userId) isChallenger = true;

    if (
      (isChallenger && challenge.isSubmittedByChallenger) ||
      (!isChallenger && challenge.isSubmittedByOpponent)
    ) {
      throw new UnprocessableEntityException('Challenge Already Submitted ');
    }
    //calculate answered questions
    for (let i = 0; i < questionsInfo.length; i++) {
      let question = challenge.questions.find(
        (q) => q.id == questionsInfo[i].id,
      );
      if (question && question.answer == questionsInfo[i].answer)
        submitterScore++;
    }

    if (isChallenger) {
      challenge.isSubmittedByChallenger = true;
      challenge.challengerScore = submitterScore;
      //if submitted by opponent determine the winner and reward the point to the winner
      //create notification for both sides

      if (challenge.isSubmittedByOpponent) {
        processMatchWinner({
          challengerId: userId,
          opponentId: challenge.opponent,
          winnerMessage: 'you win the challenge with mr x in course x',
          loserMessage: 'you lose the challenge with mr x in course x',
        });
      } else {
        //if not submitted by opponent
        challenge.save();
        return ' successfully submitted answer';
      }
    } else {
      //if not challenger who is submitting
      challenge.isSubmittedByOpponent = true;
      challenge.opponentScore = submitterScore;
      if (challenge.isSubmittedByChallenger) {
        processMatchWinner({
          challengerId: challenge.createdBy,
          opponentId: userId,
          winnerMessage: 'you win the challenge with mr x in course x',
          loserMessage: 'you lose the challenge with mr x in course x',
        });
      } else {
        //if not submitted by challenger
        challenge.save();
        return ' successfully submitted answer';
      }
    }

    // process match winner give reward and prepare notifications

    async function processMatchWinner({
      challengerId,
      opponentId,
      winnerMessage,
      loserMessage,
    }) {
      const challengerNotification =
        await this.notificationService.getNotificationByChallengeIdAndUserId(
          challenge._id,
          challengerId,
        );
      const opponentNotification =
        await this.notificationService.getNotificationByChallengeIdAndUserId(
          challenge._id,
          opponentId,
        );
      if (challenge.challengerScore > challenge.opponentScore) {
        challengerReward = challenge.assignedPoint;
        let challengerUser = await this.userService.getUserById(challengerId);
        let opponentUser = await this.userService.getUserStatus(opponentId);
        challengerUser.rewardPoint += challengerReward;
        challengerNotification.message = winnerMessage;
        challengerNotification.isViewed = false;
        opponentNotification.message = loserMessage;
        opponentNotification.isViewed = false;
        await opponentNotification.save();
        await challengerNotification.save();
        await challengerUser.save();
        //sending socket notifications if users are online
        if (challengerUser.isOnline) {
          this.notificationGateway.sendNotification({
            socketId: challengerUser.socketId,
            data: challengerNotification,
          });
        } else if (opponentUser.isOnline) {
          this.notificationGateway.sendNotification({
            socketId: opponentUser.socketId,
            data: opponentNotification,
          });
        }
      } else {
        opponentReward = challenge.assignedPoint;
        let opponentUser = await this.userService.getUserById(opponentId);
        let challengerUser = await this.userService.getUserStatus(challengerId);
        opponentUser.rewardPoint += opponentReward;
        challengerNotification.message = loserMessage;
        challengerNotification.isViewed = false;
        opponentNotification.message = winnerMessage;
        opponentNotification.isViewed = false;
        await opponentNotification.save();
        await challengerNotification.save();
        await opponentUser.save();
        //sending socket notifications if users are online
        if (opponentUser.isOnline) {
          this.notificationGateway.sendNotification({
            socketId: opponentUser.socketId,
            data: opponentNotification,
          });
        } else if (challengerUser.isOnline) {
          this.notificationGateway.sendNotification({
            socketId: challengerUser.socketId,
            data: challengerNotification,
          });
        }
      }
    }
  }
}
