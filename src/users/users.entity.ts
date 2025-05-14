// users.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Consumption } from '../consumption/consumption.entity';  // Assumindo que Consumption é a entidade relacionada

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;  // Apenas um exemplo de campo, ajuste conforme necessário

  @OneToMany(() => Consumption, (consumption) => consumption.user)
  consumptions: Consumption[];  // Relacionamento de um User com várias Consumptions
}
