import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'admins' })
export class AdminEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @Column()
  password: string;
}
