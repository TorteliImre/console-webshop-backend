import { DataSource } from 'typeorm';
import { Global, Module } from '@nestjs/common';

import { User } from 'entities/User';
import { Advert } from 'entities/Advert';
import { Location } from 'entities/Location';
import { Manufacturer } from 'entities/Manufacturer';
import { Model } from 'entities/Model';
import { ProductState } from 'entities/ProductState';
import { AdvertPic } from 'entities/AdvertPic';
import { Bookmark } from 'entities/Bookmark';
import { Comment } from 'entities/Comment';
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
              Manufacturer,
              Model,
              ProductState,
              AdvertPic,
              Bookmark,
              Comment,
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
