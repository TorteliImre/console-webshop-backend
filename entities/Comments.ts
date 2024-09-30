import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Advert } from "./Advert";
import { User } from "./User";

@Index("comments_advert_FK", ["advertId"], {})
@Index("comments_comments_FK", ["replyToId"], {})
@Index("comments_user_FK", ["userId"], {})
@Entity("comments", { schema: "console-webshop" })
export class Comments {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "user_id", nullable: true })
  userId: number | null;

  @Column("int", { name: "advert_id" })
  advertId: number;

  @Column("varchar", { name: "text", length: 1000 })
  text: string;

  @Column("int", { name: "reply_to_id", nullable: true })
  replyToId: number | null;

  @ManyToOne(() => Advert, (advert) => advert.comments, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "advert_id", referencedColumnName: "id" }])
  advert: Advert;

  @ManyToOne(() => Comments, (comments) => comments.comments, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "reply_to_id", referencedColumnName: "id" }])
  replyTo: Comments;

  @OneToMany(() => Comments, (comments) => comments.replyTo)
  comments: Comments[];

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: "SET NULL",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
