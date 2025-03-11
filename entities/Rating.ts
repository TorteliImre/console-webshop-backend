import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
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
  value: number;

  @CreateDateColumn({ name: 'created_time' })
  createdTime: Date;

  @Column('int', { name: 'purchase_id' })
  purchaseId: number;

  @OneToOne(() => Purchase, (purchase) => purchase.rating, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'purchase_id', referencedColumnName: 'id' }])
  purchase: Purchase;
}
