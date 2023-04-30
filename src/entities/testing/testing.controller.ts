import { Controller, Delete, Res } from '@nestjs/common';
import { Response } from 'express';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('testing')
export class TestingController {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  @Delete('all-data')
  async deleteAll(@Res() res: Response) {
    await this.dataSource.query(`DELETE FROM "Attempts" WHERE TRUE`);
    await this.dataSource.query(`DELETE FROM "BlogBansInfo" WHERE TRUE`);
    await this.dataSource.query(`DELETE FROM "BlogOwnerInfo" WHERE TRUE`);
    await this.dataSource.query(`DELETE FROM "CommentatorInfo" WHERE TRUE`);
    await this.dataSource.query(`DELETE FROM "LikesInfo" WHERE TRUE`);
    await this.dataSource.query(`DELETE FROM "PostInfoForComment" WHERE TRUE`);
    await this.dataSource.query(`DELETE FROM "NewestLikes" WHERE TRUE`);
    await this.dataSource.query(`DELETE FROM "ExtendedLikesInfo" WHERE TRUE`);
    await this.dataSource.query(`DELETE FROM "Devices" WHERE TRUE`);
    await this.dataSource.query(`DELETE FROM "PostsLikes" WHERE TRUE`);
    await this.dataSource.query(`DELETE FROM "CommentsLikes" WHERE TRUE`);
    await this.dataSource.query(`DELETE FROM "Tokens" WHERE TRUE`);
    await this.dataSource.query(`DELETE FROM "BlogBans" WHERE TRUE`);
    await this.dataSource.query(`DELETE FROM "UserBans" WHERE TRUE`);
    await this.dataSource.query(`DELETE FROM "BanInfo" WHERE TRUE`);
    await this.dataSource.query(`DELETE FROM "EmailConfirmation" WHERE TRUE`);
    await this.dataSource.query(`DELETE FROM "PasswordRecovery" WHERE TRUE`);
    await this.dataSource.query(`DELETE FROM "UserBanForBlog" WHERE TRUE`);
    await this.dataSource.query(`DELETE FROM "Comments" WHERE TRUE`);
    await this.dataSource.query(`DELETE FROM "Posts" WHERE TRUE`);
    await this.dataSource.query(`DELETE FROM "Blogs" WHERE TRUE`);
    await this.dataSource.query(`DELETE FROM "Users" WHERE TRUE`);
    return res.sendStatus(204);
  }
}
