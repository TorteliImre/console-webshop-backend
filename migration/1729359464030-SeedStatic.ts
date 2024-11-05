import { MigrationInterface, QueryRunner } from 'typeorm';
import { readFileSync } from 'fs';

/*
  Import the static data from CSV files.
*/
export class SeedStatic1729359464030 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (await this.isTableEmpty(queryRunner, 'location')) {
      await this.importLocations(queryRunner);
    }
    if (await this.isTableEmpty(queryRunner, 'product_states')) {
      await this.importStates(queryRunner);
    }
    if (await this.isTableEmpty(queryRunner, 'manufacturers')) {
      await this.importManufacturers(queryRunner);
    }
    if (await this.isTableEmpty(queryRunner, 'models')) {
      await this.importModels(queryRunner);
    }
  }

  private async isTableEmpty(
    queryRunner: QueryRunner,
    name: string,
  ): Promise<boolean> {
    return (
      (await queryRunner.query(`SELECT * FROM ${name} WHERE id = 1`)).length ==
      0
    );
  }

  private loadCsv(filename: string): string[][] {
    const data = readFileSync(`${__dirname}/../../data/${filename}`)
      .toString()
      .split('\n')
      .filter((e) => e.length > 1)
      .map((e) => e.trimEnd().split(';'));
    return data;
  }

  private async importLocations(queryRunner: QueryRunner): Promise<void> {
    const data = this.loadCsv('locations.csv');
    await queryRunner.startTransaction();
    for (const line of data) {
      await queryRunner.query(
        'INSERT INTO location (id, zip, name) VALUES (?, ?, ?)',
        [parseInt(line[0]), parseInt(line[1]), line[2]],
      );
    }
    await queryRunner.commitTransaction();
  }

  private async importStates(queryRunner: QueryRunner): Promise<void> {
    const data = this.loadCsv('states.csv');
    await queryRunner.startTransaction();
    for (const line of data) {
      await queryRunner.query(
        'INSERT INTO product_states (id, name) VALUES (?, ?)',
        [parseInt(line[0]), line[1]],
      );
    }
    await queryRunner.commitTransaction();
  }

  private async importManufacturers(queryRunner: QueryRunner): Promise<void> {
    const data = this.loadCsv('manufacturers.csv');
    await queryRunner.startTransaction();
    for (const line of data) {
      await queryRunner.query(
        'INSERT INTO manufacturers (id, name) VALUES (?, ?)',
        [parseInt(line[0]), line[1]],
      );
    }
    await queryRunner.commitTransaction();
  }

  private async importModels(queryRunner: QueryRunner): Promise<void> {
    const data = this.loadCsv('models.csv');
    await queryRunner.startTransaction();
    for (const line of data) {
      await queryRunner.query(
        'INSERT INTO models (id, name, manufacturer_id) VALUES (?, ?, ?)',
        [parseInt(line[0]), line[1], parseInt(line[2])],
      );
    }
    await queryRunner.commitTransaction();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
