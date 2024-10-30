import { DataSource } from 'typeorm';
import { Global, Module } from '@nestjs/common';

import { User } from 'entities/User';
import { Advert } from 'entities/Advert';
import { Location } from 'entities/Location';
import { Manufacturers } from 'entities/Manufacturers';
import { Models } from 'entities/Models';
import { ProductStates } from 'entities/ProductStates';
import { AdvertPics } from 'entities/AdvertPics';
import { Bookmarks } from 'entities/Bookmarks';
import { Comments } from 'entities/Comments';
import { CartItem } from 'entities/CartItem';
import { SeedStatic1729359464030 } from 'migration/1729359464030-SeedStatic';

const isTestingDb = true;

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: DataSource,
      inject: [],
      useFactory: async () => {
        try {
          const dataSource = new DataSource({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '',
            database: isTestingDb
              ? 'console-webshop-testing'
              : 'console-webshop',
            entities: [
              User,
              Advert,
              Location,
              Manufacturers,
              Models,
              ProductStates,
              AdvertPics,
              Bookmarks,
              Comments,
              CartItem,
            ],
            synchronize: true,
            logging: true,
            dropSchema: isTestingDb,
            migrations: [SeedStatic1729359464030],
          });
          await dataSource.initialize();
          await dataSource.runMigrations();
          return dataSource;
        } catch (error) {
          console.log('Error connecting to database');
          throw error;
        }
      },
    },
  ],
  exports: [DataSource],
})
export class DataSourceModule {}
