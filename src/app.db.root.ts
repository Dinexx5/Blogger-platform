import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const cloudDbRootOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.SQL_HOST_NAME,
  port: 5432,
  username: process.env.SQL_USERNAME,
  password: process.env.SQL_PASS,
  database: process.env.SQL_USERNAME,
  autoLoadEntities: true,
  synchronize: true,
};
export const localDbRootOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5000,
  username: process.env.SQL_USERNAME,
  password: process.env.SQL_LOCAL_PASS,
  database: 'typeORMdb',
  autoLoadEntities: true,
  synchronize: true,
};
