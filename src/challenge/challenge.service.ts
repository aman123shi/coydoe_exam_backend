import { CourseService } from '@app/course/course.service';
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
    private courseService: CourseService,
    private readonly notificationGateway: NotificationGateway,
  ) {}
  async getChallengeQuestions(challengeId: string) {
    let challenge = await this.challengeModel.findById(challengeId);
    let questions = [];
    if (!challenge) {
      throw new UnprocessableEntityException();
    }
    if (challenge.isSubmittedByOpponent) {
      return { status: 'expired', questions };
    }
    for (const questionInfo of challenge.questions) {
      let question = await this.questionService.getQuestionById(
        questionInfo.id,
      );
      questions.push(question);
    }
    return { status: 'waiting', questions };
  }
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
    //get both users
    let challengerUser = await this.userService.getUserById(userId);
    let opponentUser = await this.userService.getUserById(opponentId);
    console.log('========> userId ' + userId + ' opponentId ' + opponentId);

    //notification for challenger  user
    let challengerNotification =
      await this.notificationService.createNotification({
        userId,
        message: `waiting for ${opponentUser?.fullName} to complete the challenge`,
        referenceId: newChallenge._id,
        notificationType: 'challenge',
        isViewed: false,
      });
    //notification for opponent user
    let opponentNotification =
      await this.notificationService.createNotification({
        userId: opponentId,
        message: `${challengerUser?.fullName} is challenging you to solve biology`,
        referenceId: newChallenge._id,
        notificationType: 'challenge',
        isViewed: false,
        isLink: true,
      });
    //send socket notification to opponent if it is online
    if (opponentUser.isOnline)
      this.notificationGateway.sendNotification({
        socketId: opponentUser.socketId,
        data: opponentNotification,
      });
    //send socket notification to challenger if it is online
    if (challengerUser.isOnline)
      this.notificationGateway.sendNotification({
        socketId: challengerUser.socketId,
        data: challengerNotification,
      });
    return { challengeId: newChallenge._id, randomQuestions, rewardPoint };
  }

  async getChallengeById(id: mongoose.Schema.Types.ObjectId) {
    return await this.challengeModel.findById(id);
  }
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
    let context = this;

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
        challenge.save();
        return ' successfully submitted answer';
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
        challenge.save();
        return ' successfully submitted answer';
      } else {
        //if not submitted by challenger
        challenge.save();
        return ' successfully submitted answer';
      }
    }

    // process match winner give reward and prepare notifications
    // class context to access in methods
    async function processMatchWinner({
      challengerId,
      opponentId,
      winnerMessage,
      loserMessage,
    }) {
      const challengerNotification =
        await context.notificationService.getNotificationByChallengeIdAndUserId(
          challenge._id,
          challengerId,
        );

      const opponentNotification =
        await context.notificationService.getNotificationByChallengeIdAndUserId(
          challenge._id,
          opponentId,
        );
      if (challenge.challengerScore > challenge.opponentScore) {
        challengerReward = challenge.assignedPoint;
        let challengerUser = await context.userService.getUserById(
          challengerId,
        );
        let opponentUser = await context.userService.getUserStatus(opponentId);
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
          context.notificationGateway.sendNotification({
            socketId: challengerUser.socketId,
            data: challengerNotification,
          });
        } else if (opponentUser.isOnline) {
          context.notificationGateway.sendNotification({
            socketId: opponentUser.socketId,
            data: opponentNotification,
          });
        }
        //if their result is Equal
      } else if (challenge.challengerScore == challenge.opponentScore) {
        let opponentUser = await context.userService.getUserById(opponentId);
        let challengerUser = await context.userService.getUserById(
          challengerId,
        );
        let randomQuestions = await context.questionService.getRandomQuestion(
          challenge.courseId,
          1,
        );
        let challengerNotification =
          context.notificationService.createNotification({
            notificationType: 'next-challenge',
            isLink: true,
            message: `you have got Equal Points with ${opponentUser.fullName} in the challenge x complete this challenge first to be a winner`,
            userId: challenge.createdBy,
            referenceId: challenge._id,
          });
        let opponentNotification =
          context.notificationService.createNotification({
            notificationType: 'next-challenge',
            isLink: true,
            message: `you have got Equal Points with ${challengerUser.fullName} in the challenge x complete this challenge first to be a winner`,
            userId: challenge.opponent,
            referenceId: challenge._id,
          });
        (await challengerNotification).save();
        (await opponentNotification).save();
        challenge.additionalQuestions = [];
        challenge.additionalQuestions.push({
          id: randomQuestions[0]._id,
          answer: randomQuestions[0].answer,
        });
        challenge.isAdditionalQuestionSubmitted = false;
        await challenge.save();
        if (opponentUser.isOnline) {
          context.notificationGateway.sendNotification({
            socketId: opponentUser.socketId,
            data: opponentNotification,
          });
        } else if (challengerUser.isOnline) {
          context.notificationGateway.sendNotification({
            socketId: challengerUser.socketId,
            data: challengerNotification,
          });
        }
        // return "challenge submitted successfully with Equal result"
      } else {
        opponentReward = challenge.assignedPoint;
        let opponentUser = await context.userService.getUserById(opponentId);
        let challengerUser = await context.userService.getUserStatus(
          challengerId,
        );
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
          context.notificationGateway.sendNotification({
            socketId: opponentUser.socketId,
            data: opponentNotification,
          });
        } else if (challengerUser.isOnline) {
          context.notificationGateway.sendNotification({
            socketId: challengerUser.socketId,
            data: challengerNotification,
          });
        }
      }
    }
  }
  async getAdditionalQuestions(challengeId: string) {
    let challenge = await this.challengeModel.findById(challengeId);
    if (!challenge) {
      throw new UnprocessableEntityException("can't find the challenge");
    }
    let questions = [];
    for (const q of challenge.additionalQuestions) {
      let question = await this.questionService.getQuestionById(q.id);
      questions.push(question);
    }
    return { status: 'waiting', questions };
  }

  async submitAdditionalQuestions(
    challengeId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    questionsInfo: QuestionInfo[],
  ) {
    let challenge = await this.challengeModel.findById(challengeId);
    let challengerUser = await this.userService.getUserById(userId);
    let opponentId =
      challenge.createdBy == userId ? challenge.opponent : challenge.createdBy;
    let opponentUser = await this.userService.getUserById(opponentId);
    let course = await this.courseService.getCourseById(challenge.courseId);
    let answeredCorrectly = false;
    if (!challenge) {
      throw new UnprocessableEntityException("can't find the challenge");
    }

    //calculate answered questions
    for (let i = 0; i < challenge.additionalQuestions.length; i++) {
      let question = challenge.questions.find(
        (q) => q.id == challenge.additionalQuestions[i].id,
      );
      if (question.answer == questionsInfo[i].answer) answeredCorrectly = true;
    }

    if (
      challenge.isAdditionalQuestionSubmitted &&
      challenge.status == 'completed'
    ) {
      // notification you lose this challenge
      let notification = await this.notificationService.createNotification({
        message: `you lose the challenge with ${opponentUser.fullName} in ${course.name} because of late submission`,
        notificationType: 'challenge',
        userId,
        referenceId: challenge._id,
      });
      return 'submit success ';
    } else if (
      challenge.isAdditionalQuestionSubmitted &&
      challenge.status == 'pending'
    ) {
      //first submitter didn't get the result
      // check current user result and if win complete the challenge assign winner point
      if (answeredCorrectly) {
        challenge.status = 'completed';
        challengerUser.rewardPoint += challenge.assignedPoint;
        await challenge.save();
        await challengerUser.save();
        let submitterNotification =
          await this.notificationService.createNotification({
            message: `you win the challenge with ${opponentUser.fullName} in ${course.name}`,
            notificationType: 'challenge',
            userId,
            referenceId: challenge._id,
          });
        let otherUserNotification =
          await this.notificationService.createNotification({
            message: `you lose the challenge with ${challengerUser.fullName} in ${course.name}`,
            notificationType: 'challenge',
            userId,
            referenceId: challenge._id,
          });

        return 'submit success ';
      } else {
        //  generate additional questions if this submitter also lose

        let randomQuestions = await this.questionService.getRandomQuestion(
          challenge.courseId,
          1,
        );
        let challengerNotification =
          await this.notificationService.createNotification({
            notificationType: 'next-challenge',
            isLink: true,
            message: `you have got Equal Points with ${opponentUser.fullName} in the challenge ${course.name} complete this challenge first to be a winner`,
            userId: challenge.createdBy,
            referenceId: challenge._id,
          });
        let opponentNotification =
          await this.notificationService.createNotification({
            notificationType: 'next-challenge',
            isLink: true,
            message: `you have got Equal Points with ${challengerUser.fullName} in the challenge ${course.name} complete this challenge first to be a winner`,
            userId: challenge.opponent,
            referenceId: challenge._id,
          });

        challenge.additionalQuestions = [];
        challenge.additionalQuestions.push({
          id: randomQuestions[0]._id,
          answer: randomQuestions[0].answer,
        });
        challenge.isAdditionalQuestionSubmitted = false;
        await challenge.save();
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
        return 'challenge submit success ';
        //end
      }
    } else {
      //first time submit
      challenge.isAdditionalQuestionSubmitted = true;
      if (answeredCorrectly) {
        challenge.status = 'completed';
        challengerUser.rewardPoint += challenge.assignedPoint;
        await challenge.save();
        await challengerUser.save();
        let notification = await this.notificationService.createNotification({
          message: `you win the challenge with ${opponentUser.fullName} in ${course.name}`,
          notificationType: 'challenge',
          userId,
          referenceId: challenge._id,
        });
        return 'submit success ';
      } else {
        challenge.save();
        return 'submit success ';
      }
    }
  }
}
