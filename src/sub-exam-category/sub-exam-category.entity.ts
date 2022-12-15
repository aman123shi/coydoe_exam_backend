import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'sub-exam-categories' })
export class SubExamCategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;
  //social natural
  @Column()
  name: string;
  
  
  //which exam category it belongs 
  @Column()
  examCategory: number;
}
