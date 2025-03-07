import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from 'entities/CartItem';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Advert } from 'entities/Advert';
import { AdvertModule } from 'src/advert/advert.module';
import { AdvertService } from 'src/advert/advert.service';
import { AdvertPic } from 'entities/AdvertPic';
import { Comment } from 'entities/Comment';
import { Location } from 'entities/Location';
import { Model } from 'entities/Model';
import { PurchaseModule } from 'src/purchase/purchase.module';
import { PurchaseService } from 'src/purchase/purchase.service';
import { Purchase } from 'entities/Purchase';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CartItem,
      Advert,
      AdvertPic,
      Comment,
      Location,
      Model,
      Purchase,
    ]),
    AdvertModule,
    PurchaseModule,
  ],
  controllers: [CartController],
  providers: [CartService, AdvertService, PurchaseService],
})
export class CartModule {}
