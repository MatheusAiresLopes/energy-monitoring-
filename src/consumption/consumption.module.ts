// consumption.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consumption } from './consumption.entity';
import { ConsumptionService } from './consumption.service';
import { ConsumptionController } from './consumption.controller';
import { UsersModule } from '../users/users.module';  // Importe o UsersModule aqui

@Module({
  imports: [
    TypeOrmModule.forFeature([Consumption]),
    UsersModule,  // Certifique-se de importar o UsersModule aqui
  ],
  providers: [ConsumptionService],
  controllers: [ConsumptionController],
})
export class ConsumptionModule {}
