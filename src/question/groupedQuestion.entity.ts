import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CourseEntity } from '@app/course/course.entity';
import { DirectionEntity } from './direction.entity';
import { SubExamCategoryEntity } from '@app/sub-exam-category/sub-exam-category.entity';
@Entity({ name: 'grouped-questions' })
export class GroupedQuestionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'longtext' })
  questionText: string;

  @Column({ type: 'longtext' })
  option_a: string;

  @Column({ type: 'longtext' })
  option_b: string;

  @Column({ type: 'longtext' })
  option_c: string;

  @Column({ type: 'longtext' })
  option_d: string;

  @Column({ type: 'longtext' })
  answer: string;

  @Column({ type: 'longtext' })
  image: string;

  @Column({ type: 'longtext' })
  description: string;

  @Column()
  year: number;

  @Column()
  questionNumber: number;

  @Column()
  @ManyToOne((type) => DirectionEntity)
  direction: number; //Biology Math

  @Column({ nullable: true })
  @ManyToOne((type) => SubExamCategoryEntity)
  subExamCategory: number; //natural social
}
