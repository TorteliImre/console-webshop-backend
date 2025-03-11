import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Purchase } from './Purchase';

@Entity('ratings', { schema: 'console-webshop' })
export class Rating {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('float', { name: 'rating' })
  value: number;

  @CreateDateColumn({ name: 'created_time' })
  createdTime: Date;

  @OneToOne(() => Purchase, (purchase) => purchase.rating)
  purchase: Purchase;
}
