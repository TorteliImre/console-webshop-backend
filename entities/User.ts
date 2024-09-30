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

@Index('user_name_unique', ['name'], { unique: true })
@Entity('user', { schema: 'console-webshop' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', unique: true, length: 100 })
  name: string;

  @Column('varchar', { name: 'email', length: 100 })
  email: string;

  @Column('varchar', { name: 'bio', nullable: true, length: 1000 })
  bio: string | null;

  @Column('longblob', { name: 'picture', nullable: true })
  picture: Buffer | null;

  @Column('text', { name: 'password_hash' })
  passwordHash: string;

  @OneToMany(() => Advert, (advert) => advert.owner)
  adverts: Advert[];

  @OneToMany(() => Bookmarks, (bookmarks) => bookmarks.user)
  bookmarks: Bookmarks[];

  @OneToMany(() => Comments, (comments) => comments.user)
  comments: Comments[];
}
