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

@Index('bookmarks_adverts_FK', ['advertId'], {})
@Index('bookmarks_users_FK', ['userId'], {})
@Entity('bookmarks', { schema: 'console-webshop' })
export class Bookmark {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'user_id' })
  userId: number;

  @Column('int', { name: 'advert_id' })
  advertId: number;

  @ManyToOne(() => Advert, (advert) => advert.bookmarks, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'advert_id', referencedColumnName: 'id' }])
  advert: Advert;

  @ManyToOne(() => User, (user) => user.bookmarks, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
