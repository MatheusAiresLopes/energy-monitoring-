import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateConsumptionDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  kwh: number;

  @IsNotEmpty()
  @IsDateString()  // Valida uma string no formato de data (ISO 8601)
  date: string;
}
