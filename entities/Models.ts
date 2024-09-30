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
import { Manufacturers } from "./Manufacturers";

@Index("models_manufacturers_FK", ["manufacturerId"], {})
@Entity("models", { schema: "console-webshop" })
export class Models {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 100 })
  name: string;

  @Column("int", { name: "manufacturer_id" })
  manufacturerId: number;

  @OneToMany(() => Advert, (advert) => advert.model)
  adverts: Advert[];

  @ManyToOne(() => Manufacturers, (manufacturers) => manufacturers.models, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "manufacturer_id", referencedColumnName: "id" }])
  manufacturer: Manufacturers;
}
