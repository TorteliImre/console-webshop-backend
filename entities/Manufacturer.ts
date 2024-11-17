import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Advert } from './Advert';
import { Model } from './Model';

@Entity('manufacturers', { schema: 'console-webshop' })
export class Manufacturer {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 100 })
  name: string;

  @OneToMany(() => Model, (models) => models.manufacturer)
  models: Model[];
}
