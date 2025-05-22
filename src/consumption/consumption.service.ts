import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consumption } from './consumption.entity';
import { User } from '../users/users.entity';
import { CreateConsumptionDto } from './../dtos/history.dto';
import { Between } from 'typeorm';


@Injectable()
export class ConsumptionService {
  constructor(
    @InjectRepository(Consumption)
    private consumptionRepository: Repository<Consumption>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Criação de um novo consumo
  async create(createConsumptionDto: CreateConsumptionDto): Promise<Consumption> {
    const user = await this.userRepository.findOne({
      where: { id: createConsumptionDto.userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${createConsumptionDto.userId} not found`);
    }

    const consumption = this.consumptionRepository.create({
      kwh: createConsumptionDto.kwh,
      date: new Date(createConsumptionDto.date).toISOString().split('T')[0],
      user: user,
    });

    return await this.consumptionRepository.save(consumption);
  }

  // Busca todos os consumos
  async findAll(): Promise<Consumption[]> {
    return await this.consumptionRepository.find({
      relations: ['user'], // Inclui dados do usuário
    });
  }

  // Busca um consumo específico por ID
  async findOne(id: number): Promise<Consumption | null> {
    return await this.consumptionRepository.findOne({
      where: { id },
      relations: ['user'], // Inclui dados do usuário
    });
  }

  // Busca consumos por usuário
  async getConsumptionByUser(): Promise<any[]> {
    const users = await this.userRepository.find({ relations: ['consumptions'] });

    return users.map(user => ({
      userId: user.id,
      name: user.name,
      totalKwh: user.consumptions.reduce((sum, c) => sum + c.kwh, 0),
      records: user.consumptions.map(c => ({
        date: new Date(c.date).toISOString().split('T')[0], // Corrigido para garantir que 'c.date' seja um Date
        kwh: c.kwh
      }))
    }));
  }
async getConsumptionHistory(userId: number, startDate: string, endDate: string): Promise<Consumption[]> {
    return this.consumptionRepository.find({
      where: {
        user: { id: userId },
        date: Between(startDate, endDate),
      },
      relations: ['user'],
    });
  }

  async getHighConsumptionAlerts(userId: number): Promise<Consumption[]> {
    const today = new Date();
    const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate());
    const startDate = twoMonthsAgo.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];

    const consumptions = await this.consumptionRepository.find({
      where: {
        user: { id: userId },
        date: Between(startDate, endDate),
      },
      relations: ['user'],
    });

    // Consumo elevado: maior que 100 kWh
    return consumptions.filter(c => c.kwh > 100);
  }
  
}
