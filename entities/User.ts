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
import { Suggestion } from './Suggestion';
import { Purchase } from './Purchase';
import {
  maxUserBioLength,
  maxUserEmailLength,
  maxUserNameLength,
} from 'src/limits';

@Index('users_name_unique', ['name'], { unique: true })
@Entity('users', { schema: 'console-webshop' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', unique: true, length: maxUserNameLength })
  name: string;

  @Column('varchar', { name: 'email', length: maxUserEmailLength })
  email: string;

  @Column('varchar', { name: 'bio', default: '', length: maxUserBioLength })
  bio: string;

  @Column('longblob', { name: 'picture', default: '' })
  picture: Buffer;

  @Column('text', { name: 'password_hash' })
  passwordHash: string;

  @Column('date', { name: 'reg_date' })
  regDate: string;

  @Column('bool', { name: 'is_admin', default: false })
  isAdmin: boolean;

  @OneToMany(() => Advert, (advert) => advert.owner)
  adverts: Advert[];

  @OneToMany(() => Bookmark, (bookmarks) => bookmarks.user)
  bookmarks: Bookmark[];

  @OneToMany(() => Comment, (comments) => comments.user)
  comments: Comment[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.user)
  cartItems: Bookmark[];

  @OneToMany(() => Suggestion, (suggestions) => suggestions.user)
  suggestions: Suggestion[];

  @OneToMany(() => Purchase, (purchases) => purchases.user)
  purchases: Purchase[];

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
    result.isAdmin = this.isAdmin;
    return result;
  }
}
