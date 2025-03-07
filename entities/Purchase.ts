import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Advert } from './Advert';
import { User } from './User';

@Index('purchases_adverts_FK', ['advertId'], {})
@Index('purchases_users_FK', ['userId'], {})
@Unique(['userId', 'advertId'])
@Entity('purchases', { schema: 'console-webshop' })
export class Purchase {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'user_id' })
  userId: number;

  @Column('int', { name: 'advert_id' })
  advertId: number;

  @CreateDateColumn({ name: 'created_time' })
  createdTime: Date;

  // TODO: onDelete?, onUpdate?

  @OneToOne(() => Advert, (advert) => advert.purchase, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'advert_id', referencedColumnName: 'id' }])
  advert: Advert;

  @ManyToOne(() => User, (user) => user.purchases, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
