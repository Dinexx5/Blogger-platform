import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './domain/token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Token])],
  providers: [],
  exports: [],
})
export class TokensModule {}
