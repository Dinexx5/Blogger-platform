import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [TestingController],
  exports: [],
})
export class TestingModule {}
