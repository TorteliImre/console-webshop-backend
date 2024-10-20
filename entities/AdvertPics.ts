import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Advert } from './Advert';

@Index('advert_pics_advert_FK', ['advertId'], {})
@Entity('advert_pics', { schema: 'console-webshop' })
export class AdvertPics {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('longblob', { name: 'data' })
  data: Buffer;

  @Column('varchar', { name: 'description', default: '', length: 1000 })
  description: string;

  @Column('int', { name: 'advert_id' })
  advertId: number;

  @Column('tinyint', { name: 'is_priority', width: 1 })
  isPriority: boolean;

  @ManyToOne(() => Advert, (advert) => advert.advertPics, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'advert_id', referencedColumnName: 'id' }])
  advert: Advert;
}
