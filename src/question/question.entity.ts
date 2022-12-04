import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CourseEntity } from '@app/course/course.entity';
import { SubExamCategoryEntity } from '@app/sub-exam-category/sub-exam-category.entity';
@Entity({ name: 'questions' })
export class QuestionEntity {
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

  @Column({ type: 'longtext', nullable: true })
  image: string;

  @Column({ type: 'longtext' })
  description: string;

  @Column()
  year: number;

  @Column()
  @ManyToOne((type) => CourseEntity)
  course: number; //Biology Math

  @Column({ nullable: true })
  @ManyToOne((type) => SubExamCategoryEntity)
  subExamCategory: number; //natural social
}
