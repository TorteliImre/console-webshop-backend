import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Location } from './Location';
import { Model } from './Model';
import { ProductState } from './ProductState';
import { User } from './User';
import { AdvertPic } from './AdvertPic';
import { Bookmark } from './Bookmark';
import { Comment } from './Comment';
import { CartItem } from './CartItem';
import {
  maxAdvertDescriptionLength,
  maxAdvertRevisionLength,
  maxAdvertTitleLength,
} from 'src/limits';

@Index('adverts_locations_FK', ['locationId'], {})
@Index('adverts_models_FK', ['modelId'], {})
@Index('adverts_products_states_FK', ['stateId'], {})
@Index('adverts_users_FK', ['ownerId'], {})
@Entity('adverts', { schema: 'console-webshop' })
export class Advert {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @CreateDateColumn({ name: 'created_time' })
  createdTime: Date;

  @Column('varchar', { name: 'title', length: maxAdvertTitleLength })
  title: string;

  @Column('int', { name: 'owner_id', nullable: true })
  ownerId: number | null;

  @Column('varchar', {
    name: 'description',
    length: maxAdvertDescriptionLength,
  })
  description: string;

  @Column('int', { name: 'location_id' })
  locationId: number;

  @Column('int', { name: 'price_huf' })
  priceHuf: number;

  @Column('int', { name: 'state_id' })
  stateId: number;

  @Column('int', { name: 'model_id' })
  modelId: number;

  @Column('varchar', {
    name: 'revision',
    default: '',
    length: maxAdvertRevisionLength,
  })
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
  location: Location;

  @ManyToOne(() => Model, (models) => models.adverts, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'model_id', referencedColumnName: 'id' }])
  model: Model;

  @ManyToOne(() => ProductState, (productStates) => productStates.adverts, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'state_id', referencedColumnName: 'id' }])
  state: ProductState;

  @ManyToOne(() => User, (user) => user.adverts, {
    onDelete: 'SET NULL',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'owner_id', referencedColumnName: 'id' }])
  owner: User;

  @OneToMany(() => AdvertPic, (advertPics) => advertPics.advert)
  advertPics: AdvertPic[];

  @OneToMany(() => Bookmark, (bookmarks) => bookmarks.advert)
  bookmarks: Bookmark[];

  @OneToMany(() => Comment, (comments) => comments.advert)
  comments: Comment[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.advert)
  cartItems: Bookmark[];
}
