import { Column, Entity } from "typeorm";

@Entity("__efmigrationshistory", { schema: "console-webshop" })
export class Efmigrationshistory {
  @Column("varchar", { primary: true, name: "MigrationId", length: 150 })
  migrationId: string;

  @Column("varchar", { name: "ProductVersion", length: 32 })
  productVersion: string;
}
