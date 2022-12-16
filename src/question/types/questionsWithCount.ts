import { QuestionEntity } from '../question.entity';

export type QuestionsWithCount = {
  questions: QuestionEntity[];
  count: number;
};
