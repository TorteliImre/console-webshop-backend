import { Module } from '@nestjs/common';
import { AdvertService } from './advert.service';
import { AdvertController } from './advert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Advert } from 'entities/Advert';
import { AdvertPic } from 'entities/AdvertPic';
import { Comment } from 'entities/Comment';
import { Location } from 'entities/Location';
import { Model } from '../../entities/Model';
import { CartItem } from 'entities/CartItem';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Advert,
      AdvertPic,
      Comment,
      Location,
      Model,
      CartItem,
    ]),
  ],
  providers: [AdvertService],
  controllers: [AdvertController],
})
export class AdvertModule {}
