import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Attempt {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  requestData: string;
  @Column()
  date: string;
}
