import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'pages' })
export class PageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  courseId: number;

  @Column()
  year: number;

  @Column()
  userId: number;

  @Column()
  page: number;

  @Column()
  isSubmitted: boolean;

  @Column()
  pageSize: number;

  @Column({ default: 0, type: 'bigint' })
  startTime: number;

  @Column({ default: Date.now(), type: 'bigint' })
  submittedTime: number;
}
