import { Module } from '@nestjs/common';
import { TokenRepository } from './token.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './domain/token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Token])],
  providers: [TokenRepository],
  exports: [TokenRepository],
})
export class TokensModule {}
