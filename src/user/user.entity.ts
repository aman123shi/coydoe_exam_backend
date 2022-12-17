import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  fullName: string;

  @Column()
  phone: string;

  @Column()
  country: string;

  @Column()
  region: string;

  @Column()
  email: string;

  @Column()
  gender: string;

  @Column()
  studentType: string;

  @Column()
  password: string;
}
