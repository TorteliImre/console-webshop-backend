import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Advert } from './Advert';

@Entity('locations', { schema: 'console-webshop' })
export class Location {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 100 })
  name: string;

  @Column('varchar', { name: 'county', length: 100 })
  county: string;

  @Column('int', { name: 'zip' })
  zip: number;

  @Column('decimal', { name: 'latitude', precision: 10, scale: 7 })
  latitude: number;

  @Column('decimal', { name: 'longitude', precision: 10, scale: 7 })
  longitude: number;

  @OneToMany(() => Advert, (advert) => advert.locationId)
  adverts: Advert[];
}
