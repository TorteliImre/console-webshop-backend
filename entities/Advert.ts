import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Location } from './Location';
import { Manufacturers } from './Manufacturers';
import { Models } from './Models';
import { ProductStates } from './ProductStates';
import { User } from './User';
import { AdvertPics } from './AdvertPics';
import { Bookmarks } from './Bookmarks';
import { Comments } from './Comments';
import { CartItem } from './CartItem';

@Index('advert_location_FK', ['locationId'], {})
@Index('advert_manufacturers_FK', ['manufacturerId'], {})
@Index('advert_models_FK', ['modelId'], {})
@Index('advert_product_states_FK', ['stateId'], {})
@Index('advert_user_FK', ['ownerId'], {})
@Entity('advert', { schema: 'console-webshop' })
export class Advert {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title', length: 100 })
  title: string;

  @Column('int', { name: 'owner_id', nullable: true })
  ownerId: number | null;

  @Column('varchar', { name: 'description', length: 1000 })
  description: string;

  @Column('int', { name: 'location_id' })
  locationId: number;

  @Column('int', { name: 'price_huf' })
  priceHuf: number;

  @Column('int', { name: 'state_id' })
  stateId: number;

  @Column('int', { name: 'manufacturer_id' })
  manufacturerId: number;

  @Column('int', { name: 'model_id' })
  modelId: number;

  @Column('varchar', { name: 'revision', default: '', length: 100 })
  revision: string;

  @Column('int', { name: 'view_count', default: 0 })
  viewCount: number;

  @Column('tinyint', { name: 'is_sold', width: 1, default: 0 })
  isSold: boolean;

  @ManyToOne(() => Location, (location) => location.adverts, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'location_id', referencedColumnName: 'id' }])
  locationId2: Location;

  @ManyToOne(() => Manufacturers, (manufacturers) => manufacturers.adverts, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'manufacturer_id', referencedColumnName: 'id' }])
  manufacturer: Manufacturers;

  @ManyToOne(() => Models, (models) => models.adverts, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'model_id', referencedColumnName: 'id' }])
  model: Models;

  @ManyToOne(() => ProductStates, (productStates) => productStates.adverts, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'state_id', referencedColumnName: 'id' }])
  state: ProductStates;

  @ManyToOne(() => User, (user) => user.adverts, {
    onDelete: 'SET NULL',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'owner_id', referencedColumnName: 'id' }])
  owner: User;

  @OneToMany(() => AdvertPics, (advertPics) => advertPics.advert)
  advertPics: AdvertPics[];

  @OneToMany(() => Bookmarks, (bookmarks) => bookmarks.advert)
  bookmarks: Bookmarks[];

  @OneToMany(() => Comments, (comments) => comments.advert)
  comments: Comments[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.advert)
  cartItems: Bookmarks[];
}
