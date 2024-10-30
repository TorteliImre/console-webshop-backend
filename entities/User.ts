import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Advert } from './Advert';
import { Bookmarks } from './Bookmarks';
import { Comments } from './Comments';
import { GetUserDto } from 'src/user/user.dto';
import { CartItem } from './CartItem';

@Index('user_name_unique', ['name'], { unique: true })
@Entity('user', { schema: 'console-webshop' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', unique: true, length: 100 })
  name: string;

  @Column('varchar', { name: 'email', length: 100 })
  email: string;

  @Column('varchar', { name: 'bio', default: '', length: 1000 })
  bio: string;

  @Column('longblob', { name: 'picture', default: '' })
  picture: Buffer;

  @Column('text', { name: 'password_hash' })
  passwordHash: string;

  @OneToMany(() => Advert, (advert) => advert.owner)
  adverts: Advert[];

  @OneToMany(() => Bookmarks, (bookmarks) => bookmarks.user)
  bookmarks: Bookmarks[];

  @OneToMany(() => Comments, (comments) => comments.user)
  comments: Comments[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.user)
  cartItems: Bookmarks[];

  constructor(name: string, email: string, passwordHash: string) {
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
  }

  toGetUserDto(): GetUserDto {
    let result = new GetUserDto();
    result.id = this.id;
    result.name = this.name;
    result.email = this.email;
    result.bio = this.bio;
    result.picture = this.picture.toString('base64');
    return result;
  }
}
