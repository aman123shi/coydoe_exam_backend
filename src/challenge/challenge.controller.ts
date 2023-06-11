import { ExpressRequest } from '@app/user/types/expressRequest.interface';
import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { createChallengeParamsDto } from './dto/createChallengeParams.dto';
import { GetAdditionalQuestionDto } from './dto/getAdditionalQuestion.dto';
import { GetChallengeDto } from './dto/getChallange.dto';
import { SubmitAdditionalQuestionsDto } from './dto/submitAdditionalQuestion.dto';
import { SubmitChallengeDto } from './dto/submitChallenge.dto';
import mongoose from 'mongoose';

@Controller()
export class ChallengeController {
  constructor(private challengeService: ChallengeService) {}

  @Post('create-challenge')
  async createChallenge(
    @Body() createChallengeDto: createChallengeParamsDto,
    @Req() req: ExpressRequest,
  ) {
    return await this.challengeService.createChallenge({
      courseId: createChallengeDto.courseId,
      opponentId: createChallengeDto.opponentId,
      userId: req.userId,
    });
  }

  @Get('get-challenge-invitation')
  async getInvitationChallenge(@Req() req: ExpressRequest) {
    return await this.challengeService.getInvitationChallenge(req.userId);
  }

  @Get('get-my-challenge')
  async getMyChallenge(@Req() req: ExpressRequest) {
    return await this.challengeService.getMyChallenges(req.userId);
  }

  @Post('reject-challenge')
  async rejectChallenge(
    @Req() req: ExpressRequest,
    @Body('challengeId') challengeId: mongoose.Schema.Types.ObjectId,
  ) {
    return await this.challengeService.rejectChallenge(req.userId, challengeId);
  }

  @Post('submit-challenge')
  async submitChallenge(
    @Body() submitChallengeDto: SubmitChallengeDto,
    @Req() req: ExpressRequest,
  ) {
    return await this.challengeService.submitChallenge({
      challengeId: submitChallengeDto.challengeId,
      questionsInfo: submitChallengeDto.questionsInfo,
      userId: req.userId,
      time: submitChallengeDto.time,
    });
  }

  @Post('get-challenge-questions')
  async getChallengeQuestions(@Body() getChallengeDto: GetChallengeDto) {
    return await this.challengeService.getChallengeQuestions(
      getChallengeDto.challengeId,
    );
  }

  @Post('get-additional-questions')
  async getAdditionalChallengeQuestions(
    @Body() getAdditionalQuestionDto: GetAdditionalQuestionDto,
  ) {
    return await this.challengeService.getAdditionalQuestions(
      getAdditionalQuestionDto.challengeId,
    );
  }

  @Post('submit-additional-questions')
  async submitAdditionalQuestions(
    @Body() submitAdditionalQuestion: SubmitAdditionalQuestionsDto,
    @Req() req: ExpressRequest,
  ) {
    return await this.challengeService.submitAdditionalQuestions(
      submitAdditionalQuestion.challengeId,
      req.userId,
      submitAdditionalQuestion.questionsInfo,
    );
  }
}
