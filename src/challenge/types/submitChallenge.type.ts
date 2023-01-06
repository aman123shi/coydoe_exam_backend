import mongoose from 'mongoose';
import { QuestionInfo } from '../dto/createChallenge.dto';

export type SubmitChallenge = {
  challengeId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  questionsInfo: QuestionInfo[];
};
