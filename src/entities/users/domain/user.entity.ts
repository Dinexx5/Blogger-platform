import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  login: string;
  @Column()
  email: string;
  @Column()
  passwordHash: string;
  @Column()
  createdAt: string;
}
