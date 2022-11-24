import { ExamCategoryEntity } from '@app/exam-category/exam-category.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'courses' })
export class CourseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: false })
  @ManyToOne((type) => ExamCategoryEntity)
  examCategory: number; //Entrance COC
}
