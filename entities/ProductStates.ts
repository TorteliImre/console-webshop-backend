import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Advert } from "./Advert";

@Entity("product_states", { schema: "console-webshop" })
export class ProductStates {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 100 })
  name: string;

  @OneToMany(() => Advert, (advert) => advert.state)
  adverts: Advert[];
}
