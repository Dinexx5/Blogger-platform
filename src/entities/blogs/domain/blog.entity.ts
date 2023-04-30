import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  isMembership: boolean;
  @Column()
  websiteUrl: string;
  @Column()
  createdAt: string;
}
