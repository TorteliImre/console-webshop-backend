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
import { Rating } from './Rating';

@Index('purchases_adverts_FK', ['advertId'], {})
@Index('purchases_users_FK', ['userId'], {})
@Index('purchases_ratings_FK', ['ratingId'], {})
@Unique(['userId', 'advertId'])
@Unique(['ratingId'])
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

  @Column('int', { name: 'rating_id' })
  ratingId: number;

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

  @OneToOne(() => Rating, (rating) => rating.purchase, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'rating_id', referencedColumnName: 'id' }])
  rating: Rating;
}
