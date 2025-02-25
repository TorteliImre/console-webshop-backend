import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { maxSuggestionTextLength, maxSuggestionTitleLength } from 'src/limits';

@Index('suggestions_users_FK', ['userId'], {})
@Entity('suggestions', { schema: 'console-webshop' })
export class Suggestion {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'user_id', nullable: true })
  userId: number | null;

  @Column('varchar', { name: 'title', length: maxSuggestionTitleLength })
  title: string;

  @Column('varchar', { name: 'text', length: maxSuggestionTextLength })
  text: string;

  @CreateDateColumn({ name: 'created_time' })
  createdTime: Date;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'SET NULL',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
