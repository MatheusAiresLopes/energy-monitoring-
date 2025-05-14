import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { User } from './users/users.entity'; // ✅ Nome e caminho corretos

import { ConsumptionModule } from './consumption/consumption.module';
import { Consumption } from './consumption/consumption.entity'; // ✅ Nome e caminho corretos

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Consumption],
      synchronize: true,
    }),
    UsersModule,
    ConsumptionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
