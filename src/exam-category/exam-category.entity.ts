import { CourseEntity } from '@app/course/course.entity';

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'exam-categories' })
export class ExamCategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;
  //CoC Entrance
  @Column()
  name: string;
}
