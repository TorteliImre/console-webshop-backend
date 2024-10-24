import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Advert } from './Advert';

@Entity('location', { schema: 'console-webshop' })
export class Location {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'zip' })
  zip: number;

  @Column('varchar', { name: 'name', length: 100 })
  name: string;

  @OneToMany(() => Advert, (advert) => advert.locationId)
  adverts: Advert[];
}
