import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CourseEntity } from '@app/course/course.entity';
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
  @ManyToOne((type) => CourseEntity)
  course: number; //Biology Math

  @Column({ nullable: true })
  @ManyToOne((type) => CourseEntity)
  subExamCategory: number; //natural social
}
