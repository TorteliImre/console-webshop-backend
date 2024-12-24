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
    if (await this.isTableEmpty(queryRunner, 'adverts')) {
      await this.importAdverts(queryRunner);
    }
    if (await this.isTableEmpty(queryRunner, 'advert_pics')) {
      await this.importAdvertPics(queryRunner);
    }
  }

  private handleEmptyStr(str: String) {
    return str == '""' ? '' : str;
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

  private async importAdverts(queryRunner: QueryRunner): Promise<void> {
    const data = this.loadCsv('2_adverts.csv');
    await queryRunner.startTransaction();
    for (const line of data) {
      console.log(line);
      await queryRunner.query(
        'INSERT INTO adverts (id, title, owner_id, description, location_id, price_huf, state_id, model_id, revision, view_count, is_sold) ' +
          'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          parseInt(line[0]),
          this.handleEmptyStr(line[1]),
          parseInt(line[2]),
          this.handleEmptyStr(line[3]),
          parseInt(line[4]),
          parseInt(line[5]),
          parseInt(line[6]),
          parseInt(line[7]),
          this.handleEmptyStr(line[8]),
          parseInt(line[9]),
          parseInt(line[10]),
        ],
      );
    }
    await queryRunner.commitTransaction();
  }

  private async importAdvertPics(queryRunner: QueryRunner): Promise<void> {
    const data = this.loadCsv('3_advert_pics.csv');
    await queryRunner.startTransaction();
    for (const line of data) {
      console.log(line);
      await queryRunner.query(
        'INSERT INTO advert_pics (id, data, description, advert_id, is_priority) ' +
          'VALUES (?, ?, ?, ?, ?)',
        [
          parseInt(line[0]),
          Buffer.from(line[1], 'base64'),
          this.handleEmptyStr(line[2]),
          parseInt(line[3]),
          parseInt(line[4]),
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
