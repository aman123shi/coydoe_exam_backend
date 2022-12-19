import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'result_progress' })
export class ProgressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  courseId: number;

  @Column()
  year: number;

  @Column()
  userId: number;

  @Column()
  totalQuestions: number;

  @Column({ default: 0 })
  correctAnswers: number;

  @Column({ default: 0 })
  wrongAnswers: number;

  @Column({ default: 0, type: 'bigint' })
  totalTime: number;

  @Column({ default: 0 })
  skippedQuestions: number;

  @Column({ default: 1 })
  lastPage: number;
}
