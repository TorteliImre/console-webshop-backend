import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Advert } from "./Advert";
import { Models } from "./Models";

@Entity("manufacturers", { schema: "console-webshop" })
export class Manufacturers {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 100 })
  name: string;

  @OneToMany(() => Advert, (advert) => advert.manufacturer)
  adverts: Advert[];

  @OneToMany(() => Models, (models) => models.manufacturer)
  models: Models[];
}
