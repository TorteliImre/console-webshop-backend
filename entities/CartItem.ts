import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Advert } from './Advert';
import { User } from './User';

@Index('cart_items_advert_FK', ['advertId'], {})
@Index('cart_items_user_FK', ['userId'], {})
@Entity('cart_items', { schema: 'console-webshop' })
export class CartItem {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'user_id' })
  userId: number;

  @Column('int', { name: 'advert_id' })
  advertId: number;

  @ManyToOne(() => Advert, (advert) => advert.cartItems, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'advert_id', referencedColumnName: 'id' }])
  advert: Advert;

  @ManyToOne(() => User, (user) => user.cartItems, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
