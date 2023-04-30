import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  content: string;
  @Column()
  createdAt: string;
}
