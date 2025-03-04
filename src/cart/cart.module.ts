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

@Module({
  imports: [
    TypeOrmModule.forFeature([CartItem, Advert, AdvertPic, Comment, Location]),
    AdvertModule,
  ],
  controllers: [CartController],
  providers: [CartService, AdvertService],
})
export class CartModule {}
