/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { CourseService } from '@app/course/course.service';
import { LeaderBoardService } from '@app/leaderboard/leaderBoard.service';
import { NotificationGateway } from '@app/notification/notification.gateway';
import { NotificationService } from '@app/notification/notification.service';
import { QuestionService } from '@app/question/question.service';
import { UserService } from '@app/user/user.service';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { QuestionInfo } from './dto/createChallenge.dto';
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
    private leaderBoardService: LeaderBoardService,
  ) {}

  async rejectChallenge(
    userId: mongoose.Schema.Types.ObjectId,
    challengeId: mongoose.Schema.Types.ObjectId,
  ) {
    //delete rejector notification from client
    const challenge = await this.challengeModel.findById(challengeId);
    if (!challenge) {
      return 'challenge does not Exist';
    }
    const rejectorUser = await this.userService.getUserById(userId);
    //find challenger notification and delete it
    await this.notificationService.deleteNotification({
      referenceId: challenge._id,
      userId: challenge.createdBy,
    });

    //send notification for challenger that its challenge is rejected
    await this.notificationService.createNotification({
      userId: challenge?.createdBy,
      message:
        'the challenge you created was rejected by ' + rejectorUser?.username ??
        rejectorUser?.fullName ??
        'opponent',
      notificationType: 'inform',
      opponentUser: challenge.opponent,
    });
    //push socket notification

    //find challenger user and add game creation point

    //delete the challenge from Db
    await challenge.delete();
    return {
      status: 'success',
      message: 'challenge rejected success',
    };
  }
  async getChallengeQuestions(challengeId: string) {
    const challenge = await this.challengeModel.findById(challengeId);
    const questions = [];
    if (!challenge) {
      throw new UnprocessableEntityException();
    }

    for (const questionInfo of challenge.questions) {
      const question = await this.questionService.getQuestionById(
        questionInfo.id,
      );
      questions.push(question);
    }
    return { status: 'waiting', questions };
  }

  async getInvitationChallenge(userId: mongoose.Schema.Types.ObjectId) {
    const challenges = await this.challengeModel
      .find({
        status: 'pending',
        opponent: userId,
        isAcceptedByOpponent: false,
      })
      .populate('createdBy');
    return { data: challenges, total: challenges.length };
  }

  async getMyChallenges(userId: mongoose.Schema.Types.ObjectId) {
    const challenges = await this.challengeModel
      .find({
        status: 'pending',
        createdBy: userId,
        isAcceptedByOpponent: false,
      })
      .populate('opponent');
    return { data: challenges, total: challenges.length };
  }

  async createChallenge({ courseId, userId, opponentId }) {
    const challengerUser = await this.userService.getUserById(userId);
    //5 is a minimum point required to create a challenge
    if (challengerUser.rewardPoint < 5) {
      return new UnprocessableEntityException(
        "you don't have sufficient point to create a challenge",
      );
    }
    const newChallenge = new this.challengeModel();
    // Object.assign(newChallenge, createChallengeDto);
    const questionsInfo: QuestionInfo[] = [];
    const rewardPoint = 5;
    const randomQuestions = await this.questionService.getRandomQuestion(
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

    const opponentUser = await this.userService.getUserById(opponentId);
    console.log('========> userId ' + userId + ' opponentId ' + opponentId);

    //notification for challenger  user
    const challengerNotification =
      await this.notificationService.createNotification({
        userId,
        message: `waiting for ${
          opponentUser?.fullName ?? opponentUser?.username
        } to complete the challenge`,
        referenceId: newChallenge._id,
        notificationType: 'challenge',
        isViewed: false,
        opponentUser: opponentId,
      });
    //notification for opponent user
    const opponentNotification =
      await this.notificationService.createNotification({
        userId: opponentId,
        message: `${
          challengerUser?.fullName ?? challengerUser?.username
        } is challenging you to solve biology`,
        referenceId: newChallenge._id,
        notificationType: 'challenge',
        isViewed: false,
        isLink: true,
        opponentUser: userId,
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
    const updatedChallenge = await this.challengeModel.findOneAndUpdate(
      { _id: id },
      updateChallengeDto,
    );
    return updatedChallenge;
  }

  async submitChallenge({
    challengeId,
    userId,
    questionsInfo,
    time,
  }: SubmitChallenge) {
    //:TODO
    //on submit identify if the submitter is a challenger or opponent
    // calculate answered questions and assign its score
    //identify if the other side already submitted
    //if submitted identify the winner and award the point to the winner
    //then create notification for both side and push
    //*else* if not submitted by other side calculate answered question and update user score,submittedByChallenger or Challenger
    const challenge = await this.challengeModel.findById(challengeId);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this; //capturing the class context to access it inside internal functions
    const course = await this.courseService.getCourseById(challenge.courseId);

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
      const question = challenge.questions.find(
        (q) => q.id == questionsInfo[i].id,
      );
      if (question && question.answer == questionsInfo[i].answer)
        submitterScore++;
    }

    if (isChallenger) {
      challenge.isSubmittedByChallenger = true;
      challenge.challengerScore = submitterScore;
      challenge.challengerTime = time;
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
      challenge.opponentTime = time;
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
        challenge.status = 'completed';
        const challengerUser = await context.userService.getUserById(
          challengerId,
        );
        const opponentUser = await context.userService.getUserById(opponentId);
        challengerUser.rewardPoint += challengerReward;
        opponentUser.rewardPoint -= challenge.assignedPoint;
        //inserting to leaderBoard
        context.leaderBoardService.insertNewUserPointAndUpdateUserRank(
          challengerUser._id,
          challenge.assignedPoint,
        );
        context.leaderBoardService.insertNewUserPointAndUpdateUserRank(
          opponentUser._id,
          -challenge.assignedPoint, //negative to subtract
        );
        challengerNotification.message = `you win the challenge with  ${
          opponentUser?.username ?? opponentUser?.fullName
        } in course ${course.name}`;
        challengerNotification.isViewed = false;
        challengerNotification.isLink = false;
        opponentNotification.message = `you lose the challenge with  ${
          challengerUser?.username ?? challengerUser?.fullName
        } in course ${course.name}`;
        opponentNotification.isViewed = false;
        opponentNotification.isLink = false;
        // --
        await opponentNotification.save();
        await challengerNotification.save();
        await challengerUser.save();
        await opponentUser.save();
        //sending socket notifications if users are online
        if (challengerUser.isOnline) {
          context.notificationGateway.sendNotification({
            socketId: challengerUser.socketId,
            data: challengerNotification,
          });
          context.notificationGateway.sendUserPointNotification({
            socketId: challengerUser.socketId,
            data: challengerUser.rewardPoint,
          });
        }
        if (opponentUser.isOnline) {
          context.notificationGateway.sendNotification({
            socketId: opponentUser.socketId,
            data: opponentNotification,
          });
          context.notificationGateway.sendUserPointNotification({
            socketId: opponentUser.socketId,
            data: opponentUser.rewardPoint,
          });
        }
        //if their result is Equal
      } else if (challenge.challengerScore == challenge.opponentScore) {
        const opponentUser = await context.userService.getUserById(opponentId);
        const challengerUser = await context.userService.getUserById(
          challengerId,
        );
        const randomQuestions = await context.questionService.getRandomQuestion(
          challenge.courseId,
          1,
        );
        const challengerNotification =
          context.notificationService.createNotification({
            notificationType: 'next-challenge',
            isLink: true,
            message: `you have got Equal Points with ${opponentUser.fullName} in the challenge ${course.name} complete this challenge first to be a winner`,
            userId: challenge.createdBy,
            referenceId: challenge._id,
            opponentUser: challenge.opponent,
          });
        const opponentNotification =
          context.notificationService.createNotification({
            notificationType: 'next-challenge',
            isLink: true,
            message: `you have got Equal Points with ${challengerUser.fullName} in the challenge ${course.name} complete this challenge first to be a winner`,
            userId: challenge.opponent,
            referenceId: challenge._id,
            opponentUser: challenge.createdBy,
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
        challenge.status = 'completed';
        opponentReward = challenge.assignedPoint;
        const opponentUser = await context.userService.getUserById(opponentId);
        const challengerUser = await context.userService.getUserById(
          challengerId,
        );
        opponentUser.rewardPoint += challenge.assignedPoint;
        challengerUser.rewardPoint -= challenge.assignedPoint;
        //inserting to leaderBoard
        context.leaderBoardService.insertNewUserPointAndUpdateUserRank(
          opponentUser._id,
          challenge.assignedPoint,
        );
        context.leaderBoardService.insertNewUserPointAndUpdateUserRank(
          challengerUser._id,
          -challenge.assignedPoint, //negative to subtract
        );

        challengerNotification.message = `you lose the challenge with  ${
          opponentUser?.username ?? opponentUser?.fullName
        } in course ${course.name}`;

        challengerNotification.isViewed = false;

        opponentNotification.message = `you Win the challenge with  ${
          challengerUser?.username ?? challengerUser?.fullName
        } in course ${course.name}`;

        opponentNotification.isViewed = false;
        await opponentNotification.save();
        await challengerNotification.save();
        await opponentUser.save();
        await challengerUser.save();
        //sending socket notifications if users are online
        if (opponentUser.isOnline) {
          context.notificationGateway.sendNotification({
            socketId: opponentUser.socketId,
            data: opponentNotification,
          });
          context.notificationGateway.sendUserPointNotification({
            socketId: challengerUser.socketId,
            data: challengerUser.rewardPoint,
          });
        }
        if (challengerUser.isOnline) {
          context.notificationGateway.sendNotification({
            socketId: challengerUser.socketId,
            data: challengerNotification,
          });
          context.notificationGateway.sendUserPointNotification({
            socketId: opponentUser.socketId,
            data: opponentUser.rewardPoint,
          });
        }
      }
    }
  }

  async getAdditionalQuestions(challengeId: string) {
    const challenge = await this.challengeModel.findById(challengeId);
    if (!challenge) {
      throw new UnprocessableEntityException("can't find the challenge");
    }
    const questions = [];
    for (const q of challenge.additionalQuestions) {
      const question = await this.questionService.getQuestionById(q.id);
      questions.push(question);
    }
    return { status: 'waiting', questions };
  }

  async submitAdditionalQuestions(
    challengeId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    questionsInfo: QuestionInfo[],
  ) {
    const challenge = await this.challengeModel.findById(challengeId);
    const challengerUser = await this.userService.getUserById(userId);
    const opponentId =
      challenge.createdBy == userId ? challenge.opponent : challenge.createdBy;
    const opponentUser = await this.userService.getUserById(opponentId);
    const course = await this.courseService.getCourseById(challenge.courseId);
    let answeredCorrectly = false;
    if (!challenge) {
      throw new UnprocessableEntityException("can't find the challenge");
    }

    //calculate answered questions
    for (let i = 0; i < challenge.additionalQuestions.length; i++) {
      const question = challenge.additionalQuestions.find(
        (q) => q.id == questionsInfo[i].id,
      );
      //this logic should be changed if submitted questions are more than one
      if (question && question.answer == questionsInfo[i].answer)
        answeredCorrectly = true;
    }

    if (
      challenge.isAdditionalQuestionSubmitted &&
      challenge.status == 'completed'
    ) {
      // notification you lose this challenge
      await this.notificationService.createNotification({
        message: `you lose the challenge with ${
          opponentUser.fullName ?? opponentUser.username
        } in ${course.name} because of late submission`,
        notificationType: 'challenge',
        userId,
        referenceId: challenge._id,
        opponentUser: opponentUser._id,
      });
      //socket fire todo
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
        opponentUser.rewardPoint -= challenge.assignedPoint;
        //save to leader board
        this.leaderBoardService.insertNewUserPointAndUpdateUserRank(
          challengerUser._id,
          challenge.assignedPoint,
        );
        this.leaderBoardService.insertNewUserPointAndUpdateUserRank(
          opponentUser._id,
          -challenge.assignedPoint,
        );
        await challenge.save();
        await challengerUser.save();
        await opponentUser.save();

        const submitterNotification =
          await this.notificationService.createNotification({
            message: `you win the challenge with ${
              opponentUser.fullName ?? opponentUser.username
            } in ${course.name}`,
            notificationType: 'challenge',
            userId,
            referenceId: challenge._id,
            opponentUser: opponentUser._id,
          });

        const opponentNotification =
          await this.notificationService.createNotification({
            message: `you lose the challenge with ${
              challengerUser.fullName ?? challengerUser.username
            } in ${course.name}`,
            notificationType: 'challenge',
            userId: opponentUser._id,
            referenceId: challenge._id,
            opponentUser: challengerUser._id,
          });
        if (opponentUser.isOnline) {
          this.notificationGateway.sendNotification({
            socketId: opponentUser.socketId,
            data: opponentNotification,
          });
          this.notificationGateway.sendUserPointNotification({
            socketId: opponentUser.socketId,
            data: opponentUser.rewardPoint,
          });
        }
        if (challengerUser.isOnline) {
          this.notificationGateway.sendNotification({
            socketId: challengerUser.socketId,
            data: submitterNotification,
          });
          this.notificationGateway.sendUserPointNotification({
            socketId: challengerUser.socketId,
            data: challengerUser.rewardPoint,
          });
        }
        return 'submit success ';
      } else {
        //  generate additional questions if this submitter also lose

        const randomQuestions = await this.questionService.getRandomQuestion(
          challenge.courseId,
          1,
        );

        const challengerNotification =
          await this.notificationService.createNotification({
            notificationType: 'next-challenge',
            isLink: true,
            message: `you have got Equal Points with ${
              opponentUser.fullName ?? opponentUser.username
            } in the challenge ${
              course.name
            }, complete this challenge first to be a winner`,
            userId: challenge.createdBy,
            referenceId: challenge._id,
            opponentUser: opponentUser._id,
          });

        const opponentNotification =
          await this.notificationService.createNotification({
            notificationType: 'next-challenge',
            isLink: true,
            message: `you have got Equal Points with ${
              challengerUser.fullName ?? challengerUser.username
            } in the challenge ${
              course.name
            }, complete this challenge first to be a winner`,
            userId: challenge.opponent,
            referenceId: challenge._id,
            opponentUser: challengerUser._id,
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
        }
        if (challengerUser.isOnline) {
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
        opponentUser.rewardPoint -= challenge.assignedPoint;
        //leader board
        this.leaderBoardService.insertNewUserPointAndUpdateUserRank(
          challengerUser._id,
          challenge.assignedPoint,
        );
        this.leaderBoardService.insertNewUserPointAndUpdateUserRank(
          opponentUser._id,
          -challenge.assignedPoint,
        );
        await challenge.save();
        await challengerUser.save();
        await opponentUser.save();

        const challengerNotification =
          await this.notificationService.createNotification({
            message: `you win the challenge with ${
              opponentUser.fullName ?? opponentUser.username
            } in ${course.name}`,
            notificationType: 'challenge',
            userId,
            referenceId: challenge._id,
            opponentUser: opponentUser._id,
          });

        const opponentNotification =
          await this.notificationService.createNotification({
            message: `you lose the challenge with ${
              challengerUser.fullName ?? challengerUser.username
            } in ${course.name}`,
            notificationType: 'challenge',
            userId: opponentUser._id,
            referenceId: challenge._id,
            opponentUser: challengerUser._id,
          });
        //socket event for both
        if (opponentUser.isOnline) {
          this.notificationGateway.sendNotification({
            socketId: opponentUser.socketId,
            data: opponentNotification,
          });
          this.notificationGateway.sendUserPointNotification({
            socketId: opponentUser.socketId,
            data: opponentUser.rewardPoint,
          });
        }
        if (challengerUser.isOnline) {
          this.notificationGateway.sendNotification({
            socketId: challengerUser.socketId,
            data: challengerNotification,
          });
          this.notificationGateway.sendUserPointNotification({
            socketId: challengerUser.socketId,
            data: challengerUser.rewardPoint,
          });
        }
        return 'submit success ';
      } else {
        challenge.save();
        return 'submit success ';
      }
    }
  }

  async getChallengeReview(userId: mongoose.Schema.Types.ObjectId) {
    const challenges = await this.challengeModel.find({
      status: 'completed',
      $or: [{ createdBy: userId }, { opponent: userId }],
    });
    let challengeReports = [],
      isChallenger = false,
      status: any = {};
    for (const challenge of challenges) {
      if (challenge.createdBy == userId) isChallenger = true;
      const opponentId = isChallenger
        ? challenge.opponent
        : challenge.createdBy;
      if (isChallenger && challenge.challengerScore > challenge.opponentScore) {
        status.pointDeducted = 0;
        status.pointAwarded = challenge.assignedPoint;
      } else if (
        isChallenger &&
        challenge.challengerScore < challenge.opponentScore
      ) {
        status.pointDeducted = -challenge.assignedPoint;
        status.pointAwarded = 0;
      } else if (
        !isChallenger &&
        challenge.opponentScore > challenge.challengerScore
      ) {
        status.pointDeducted = 0;
        status.pointAwarded = challenge.assignedPoint;
      } else if (
        !isChallenger &&
        challenge.opponentScore < challenge.challengerScore
      ) {
        status.pointDeducted = -challenge.assignedPoint;
        status.pointAwarded = 0;
      }
      const challengeTime = isChallenger
        ? challenge.challengerTime
        : challenge.opponentTime;
      const course = await this.courseService.getCourseById(challenge.courseId);
      const opponentUser = await this.userService.getUserById(opponentId);
      const challengeReport = {
        ...status,
        totalTime: challengeTime,
        totalQuestions: 5,
        courseName: course.name,
        opponentName: opponentUser.username,
        totalPoint: 12,
        totalRank: 2,
      };
      challengeReports.push(challengeReport);
    }
    return challengeReports;
  }
}
