import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { User } from 'entities/User';
import { Advert } from 'entities/Advert';
import { Location } from 'entities/Location';
import { Manufacturers } from 'entities/Manufacturers';
import { Models } from 'entities/Models';
import { ProductStates } from 'entities/ProductStates';
import { AdvertPics } from 'entities/AdvertPics';
import { Bookmarks } from 'entities/Bookmarks';
import { Comments } from 'entities/Comments';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { FiltersModule } from './filters/filters.module';
import { FiltersController } from './filters/filters.controller';
import { FiltersService } from './filters/filters.service';
import { AdvertModule } from './advert/advert.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'console-webshop',
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
      ],
      synchronize: true,
      autoLoadEntities: true,
      logging: true,
    }),
    UserModule,
    AuthModule,
    FiltersModule,
    AdvertModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
