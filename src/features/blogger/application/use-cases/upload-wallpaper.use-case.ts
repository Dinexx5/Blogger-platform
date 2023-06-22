import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from '../../../public/posts/domain/post.entity';
import { Repository } from 'typeorm';

export class UploadWallpaperCommand {
  constructor(public blogId: number, public userId: number) {}
}

@CommandHandler(UploadWallpaperCommand)
export class UploadWallpaperUseCase implements ICommandHandler<UploadWallpaperCommand> {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsTypeOrmRepository: Repository<PostEntity>,
  ) {}
  async execute() {
    return null;
  }
}
