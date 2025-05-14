import {
  Controller,
  Get,
  Render,
  Post,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { ConsumptionService } from './consumption.service';
import { CreateConsumptionDto } from '../dtos/history.dto';

@Controller('consumption')
export class ConsumptionController {
  constructor(private readonly consumptionService: ConsumptionService) {}

  // Rota para criar um novo consumo
  @Post()
  create(@Body() createConsumptionDto: CreateConsumptionDto) {
    return this.consumptionService.create(createConsumptionDto);
  }

  // Rota para buscar todos os consumos
  @Get()
  findAll() {
    return this.consumptionService.findAll();
  }

  // ✅ Rota para renderizar a página com dados de consumo (deve vir antes da rota com parâmetro)
  @Get('tela')
  @Render('consumption') // Renderiza views/consumption.hbs
  async renderConsumptionPage() {
    const data = await this.consumptionService.getConsumptionByUser();
    return { users: data };
  }

  // Rota para buscar um consumo específico por ID
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const consumption = await this.consumptionService.findOne(id);
    if (!consumption) {
      throw new NotFoundException(`Consumption with ID ${id} not found`);
    }
    return consumption;
  }
}
