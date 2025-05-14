// consumption.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/users.entity';  // Assumindo que User é a entidade relacionada

@Entity()
export class Consumption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  kwh: number;

  @Column()
  date: string;  // Ou Date, dependendo do seu modelo

  @ManyToOne(() => User, (user) => user.consumptions)
  user: User;  // Relacionamento com a entidade User
}
