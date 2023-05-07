import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { createTokenModel, tokenSqlModel } from './tokens.models';

@Injectable()
export class TokenRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
}
