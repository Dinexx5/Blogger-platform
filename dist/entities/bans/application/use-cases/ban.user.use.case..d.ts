import { UsersRepository } from '../../../users/users.repository';
import { BanModel } from '../../../users/userModels';
import { BansRepository } from '../../bans.repository';
import { BlogsRepository } from '../../../blogs/blogs.repository';
import { PostsRepository } from '../../../posts/posts.repository';
import { CommentsRepository } from '../../../comments/comments.repository';
import { ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { UserBanInfo } from '../../../users/domain/banInfo.entity';
import { Token } from '../../../tokens/domain/token.entity';
import { Device } from '../../../devices/domain/device.entity';
import { SaUserBan } from '../../domain/saUserBan.entity';
export declare class BansUserCommand {
    userId: number;
    inputModel: BanModel;
    constructor(userId: number, inputModel: BanModel);
}
export declare class BansUserUseCase implements ICommandHandler<BansUserCommand> {
    private readonly userBanInfoRepository;
    private readonly tokenRepository;
    protected usersRepository: UsersRepository;
    protected blogsRepository: BlogsRepository;
    protected postsRepository: PostsRepository;
    protected commentsRepository: CommentsRepository;
    protected bansRepository: BansRepository;
    private readonly bansTypeOrmRepository;
    private readonly devicesRepository;
    constructor(userBanInfoRepository: Repository<UserBanInfo>, tokenRepository: Repository<Token>, usersRepository: UsersRepository, blogsRepository: BlogsRepository, postsRepository: PostsRepository, commentsRepository: CommentsRepository, bansRepository: BansRepository, bansTypeOrmRepository: Repository<SaUserBan>, devicesRepository: Repository<Device>);
    execute(command: BansUserCommand): Promise<boolean>;
}
