import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../admin/users/users.repository';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TgAuthCodeEntity } from '../../domain/tg-auth-code.entity';
import { ForbiddenException } from '@nestjs/common';

export class GetTgAuthLinkCommand {
  constructor(public userId: number) {}
}

@CommandHandler(GetTgAuthLinkCommand)
export class GetTgAuthLinkUseCase implements ICommandHandler<GetTgAuthLinkCommand> {
  constructor(
    protected usersRepository: UsersRepository,
    @InjectRepository(TgAuthCodeEntity)
    private readonly tgAuthCodesRepository: Repository<TgAuthCodeEntity>,
  ) {}
  async execute(command: GetTgAuthLinkCommand) {
    const userId = command.userId;
    const isAlreadyRegistered = await this.tgAuthCodesRepository.findOneBy({ userId: userId });

    if (isAlreadyRegistered) {
      throw new ForbiddenException();
    }

    const uniqueCode = uuidv4();
    const authLink = `https://t.me/test_ht30_Bot?code=${uniqueCode}`;
    const newAuthCode = await TgAuthCodeEntity.createAuthCode(uniqueCode, userId);
    await this.tgAuthCodesRepository.save(newAuthCode);
    return { link: authLink.toString() };
  }
}
