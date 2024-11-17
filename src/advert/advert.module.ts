import { Module } from '@nestjs/common';
import { AdvertService } from './advert.service';
import { AdvertController } from './advert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Advert } from 'entities/Advert';
import { AdvertPic } from 'entities/AdvertPic';

@Module({
  imports: [TypeOrmModule.forFeature([Advert, AdvertPic])],
  providers: [AdvertService],
  controllers: [AdvertController],
})
export class AdvertModule {}
