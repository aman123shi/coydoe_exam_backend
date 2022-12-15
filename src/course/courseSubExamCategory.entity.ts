import { ExamCategoryEntity } from '@app/exam-category/exam-category.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'courseSubExamCategoryEntity' })
export class CourseSubExamCategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  course: number; //Biology Math

  @Column({ nullable: false })
  subExamCategory: number; //Natural Social
}
