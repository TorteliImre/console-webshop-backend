import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from 'entities/CartItem';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Advert } from 'entities/Advert';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem, Advert])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
