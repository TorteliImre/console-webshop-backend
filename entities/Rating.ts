import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Purchase } from './Purchase';

@Index('ratings_purchases_FK', ['purchaseId'], {})
@Unique(['purchaseId'])
@Entity('ratings', { schema: 'console-webshop' })
export class Rating {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('float', { name: 'rating' })
  rating: number;

  @CreateDateColumn({ name: 'created_time' })
  createdTime: Date;

  @Column('int', { name: 'purchase_id' })
  purchaseId: number;

  // FIXME
  @JoinColumn([{ name: 'purchase_id', referencedColumnName: 'id' }])
  purchase: Purchase;
}
