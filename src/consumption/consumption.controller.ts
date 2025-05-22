import {
  Controller,
  Get,
  Render,
  Post,
  Param,
  Body,
  NotFoundException,
  Query,
  ParseIntPipe,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { ConsumptionService } from './consumption.service';
import {
  CreateConsumptionDto,
  ConsumptionHistoryQueryDto,
  AlertQueryDto,
} from '../dtos/history.dto';

@Controller('consumption')
export class ConsumptionController {
  constructor(private readonly consumptionService: ConsumptionService) {}

  // ✅ Cadastro de Consumo (POST)
  @Post()
  async create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createConsumptionDto: CreateConsumptionDto,
  ) {
    return this.consumptionService.create(createConsumptionDto);
  }

  // ✅ Listar todos os consumos (GET)
  @Get()
  async findAll() {
    return this.consumptionService.findAll();
  }

  // ✅ Tela de visualização geral (GET)
  @Get('tela')
  @Render('consumption') // Renderiza views/consumption.hbs
  async renderConsumptionPage() {
    const data = await this.consumptionService.getConsumptionByUser();
    return { users: data };
  }

  // ✅ Tela para cadastro de consumo (GET)
  @Get('cadastro')
  @Render('cadastro-consumo') // Renderiza views/cadastro-consumo.hbs
  showCadastroForm() {
    return {};
  }

  // ✅ Página com formulário e histórico (GET) — userId opcional
  @Get('history-page')
  @Render('historico-consumo') // Renderiza views/historico-consumo.hbs
  async renderHistoryPage(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: ConsumptionHistoryQueryDto,
  ) {
    if (query.userId) {
      const today = new Date().toISOString().slice(0, 10);
      const startDate = query.startDate || today;
      const endDate = query.endDate || today;

      const history = await this.consumptionService.getConsumptionHistory(
        query.userId,
        startDate,
        endDate,
      );

      return { history };
    }
    return {};
  }

  // ✅ Histórico de consumo (API GET) — userId obrigatório
  @Get('history')
  async getHistory(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    query: ConsumptionHistoryQueryDto,
  ) {
    if (!query.userId) {
      throw new BadRequestException(
        'userId é obrigatório e deve ser um número inteiro',
      );
    }

    const today = new Date().toISOString().slice(0, 10);
    const startDate = query.startDate || today;
    const endDate = query.endDate || today;

    return this.consumptionService.getConsumptionHistory(
      query.userId,
      startDate,
      endDate,
    );
  }

  // ✅ Alertas de consumo elevado (GET)
  @Get('alerts')
  async getAlerts(@Query('userId', ParseIntPipe) userId: number) {
    const alerts = await this.consumptionService.getHighConsumptionAlerts(
      userId,
    );
    return { alerts };
  }

  // ✅ Página de alertas com formulário e lista (GET) — userId opcional
  @Get('alerts-page')
  @Render('alertas-consumo') // Renderiza views/alertas-consumo.hbs
  async renderAlertsPage(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: AlertQueryDto,
  ) {
    if (query.userId) {
      const alerts = await this.consumptionService.getHighConsumptionAlerts(
        query.userId,
      );
      return { alerts };
    }
    return {};
  }

  // ✅ Buscar por ID (GET) - deve ficar por último para não conflitar com rotas estáticas
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const consumption = await this.consumptionService.findOne(id);
    if (!consumption) {
      throw new NotFoundException(
        `Consumption with ID ${id} not found`,
      );
    }
    return consumption;
  }
}
