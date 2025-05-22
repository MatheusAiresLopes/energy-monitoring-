import { IsNotEmpty, IsInt, IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateConsumptionDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()  // userId deve ser um inteiro
  userId: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()  // kWh pode ser decimal
  kwh: number;

  @IsNotEmpty()
  @IsDateString()  // Valida se é uma string de data no formato ISO (ex: 2025-05-21)
  date: string;
}

export class ConsumptionHistoryQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()  // Mesmo opcional, se informado, deve ser inteiro
  userId?: number;

  @IsOptional()
  @IsDateString()  // valida que, se informado, é uma data válida
  startDate?: string;

  @IsOptional()
  @IsDateString()  // idem acima
  endDate?: string;
}

export class AlertQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;
}
