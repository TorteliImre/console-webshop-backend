import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Advert } from './Advert';
import { Bookmark } from './Bookmark';
import { Comment } from './Comment';
import { GetUserResponseDto } from 'src/user/user.dto';
import { CartItem } from './CartItem';

@Index('users_name_unique', ['name'], { unique: true })
@Entity('users', { schema: 'console-webshop' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', unique: true, length: 20 })
  name: string;

  @Column('varchar', { name: 'email', length: 100 })
  email: string;

  @Column('varchar', { name: 'bio', default: '', length: 1000 })
  bio: string;

  @Column('longblob', { name: 'picture', default: '' })
  picture: Buffer;

  @Column('text', { name: 'password_hash' })
  passwordHash: string;

  @Column('date', { name: 'reg_date' })
  regDate: string;

  @OneToMany(() => Advert, (advert) => advert.owner)
  adverts: Advert[];

  @OneToMany(() => Bookmark, (bookmarks) => bookmarks.user)
  bookmarks: Bookmark[];

  @OneToMany(() => Comment, (comments) => comments.user)
  comments: Comment[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.user)
  cartItems: Bookmark[];

  constructor(
    name: string,
    email: string,
    passwordHash: string,
    regDate: string,
  ) {
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.regDate = regDate;
  }

  toGetUserDto(): GetUserResponseDto {
    let result = new GetUserResponseDto();
    result.id = this.id;
    result.name = this.name;
    result.bio = this.bio;
    result.picture = this.picture.toString('base64');
    result.regDate = this.regDate;
    return result;
  }
}
