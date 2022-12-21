import { Question } from '../schemas/question.schema';

export type QuestionsWithCount = {
  questions: Question[];
  count: number;
};
