import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CourseEntity } from '@app/course/course.entity';
@Entity({ name: 'questions' })
export class QuestionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  questionText: string;

  @Column()
  option_a: string;

  @Column()
  option_b: string;

  @Column()
  option_c: string;

  @Column()
  option_d: string;

  @Column()
  answer: string;

  @Column()
  image: string;

  @Column()
  description: string;

  @Column()
  year: number;

  @Column()
  @ManyToOne((type) => CourseEntity)
  course: number; //Biology Math

  @Column({ nullable: true })
  @ManyToOne((type) => CourseEntity)
  subExamCategory: number; //natural social
}
