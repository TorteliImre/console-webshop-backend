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
import { SeedSample1734438508319 } from 'migration/1734438508319-SeedSample';
import { ConfigService } from '@nestjs/config';

const TESTING_DB_DEFAULT = 'true';
const LOAD_SAMPLE_DATA_DEFAULT = 'true';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: DataSource,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        try {
          const dataSource = new DataSource({
            type: 'mysql',
            host: configService.get<string>('DATABASE_HOST', 'localhost'),
            port: configService.get<number>('DATABASE_PORT', 3306),
            username: configService.get<string>('DATABASE_USER', 'root'),
            password: configService.get<string>('DATABASE_PASSWORD', ''),
            database:
              configService.get<string>('TESTING_DB', TESTING_DB_DEFAULT) ==
              'true'
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
            dropSchema:
              configService.get<string>('TESTING_DB', TESTING_DB_DEFAULT) ==
              'true',
            migrations:
              configService.get<string>(
                'LOAD_SAMPLE_DATA',
                LOAD_SAMPLE_DATA_DEFAULT,
              ) == 'true'
                ? [SeedStatic1729359464030, SeedSample1734438508319]
                : [SeedStatic1729359464030],
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
