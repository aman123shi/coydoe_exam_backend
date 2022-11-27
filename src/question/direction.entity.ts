import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CourseEntity } from '@app/course/course.entity';
@Entity({ name: 'directions' })
export class DirectionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'longtext' })
  directionText: string;

  @Column({ type: 'longtext', nullable: true })
  sectionName: string; //section three grammar

  @Column()
  directionNumber: number;

  @Column()
  startQuestionNumber: number;

  @Column()
  endQuestionNumber: number;

  @Column()
  course: number;

  @Column()
  courseYear: number;

  @Column({ type: 'longtext', nullable: true })
  passage: string;
}
