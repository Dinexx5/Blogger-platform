import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BlogOwnerInfo } from './blog-owner-info.entity';
import { BlogBansInfo } from './blog-bans-info.entity';

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
  @OneToOne(() => BlogOwnerInfo, (ow) => ow.blog)
  blogOwnerInfo: BlogOwnerInfo;
  @OneToOne(() => BlogBansInfo, (bi) => bi.blog)
  banInfo: BlogBansInfo;
}
