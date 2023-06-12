import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BlogOwnerInfoEntity } from './blog-owner-info.entity';
import { BlogBanInfoEntity } from './blog-ban-info.entity';
import { createBlogDto } from '../dto/create.blog.dto.to';

@Entity()
export class BlogEntity {
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
  @OneToOne(() => BlogOwnerInfoEntity, (ow) => ow.blog)
  blogOwnerInfo: BlogOwnerInfoEntity;
  @OneToOne(() => BlogBanInfoEntity, (bi) => bi.blog)
  banInfo: BlogBanInfoEntity;
  static createBlog(inputModel: createBlogDto): BlogEntity {
    const blog = new BlogEntity();
    blog.name = inputModel.name;
    blog.description = inputModel.description;
    blog.websiteUrl = inputModel.websiteUrl;
    blog.isMembership = false;
    blog.createdAt = new Date().toISOString();
    return blog;
  }
}
