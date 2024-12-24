import { MigrationInterface, QueryRunner } from 'typeorm';
import { readFileSync } from 'fs';

/*
  Import the sample data from CSV files.
*/
export class SeedSample1734438508319 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (await this.isTableEmpty(queryRunner, 'users')) {
      await this.importUsers(queryRunner);
    }
  }

  private async importUsers(queryRunner: QueryRunner): Promise<void> {
    const data = this.loadCsv('1_users.csv');
    await queryRunner.startTransaction();
    for (const line of data) {
      console.log(line);
      await queryRunner.query(
        'INSERT INTO users (id, name, email, bio, picture, password_hash, reg_date) ' +
          'VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          parseInt(line[0]),
          line[1],
          line[2],
          line[3],
          Buffer.from(line[4], 'base64'),
          line[5],
          line[6].replaceAll('"', ''),
        ],
      );
    }
    await queryRunner.commitTransaction();
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
    const data = readFileSync(`${__dirname}/../../data/sample/${filename}`)
      .toString()
      .split('\n')
      .filter((e) => e.length > 1)
      .map((e) => e.trimEnd().split(';'));
    return data;
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
