export class CreateUserBanForBlogDto {
  userId: number;
  login: string;
  blogId: number;
  banReason: string;
  bannedPostsIds: number[];
}
