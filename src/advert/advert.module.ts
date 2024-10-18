import { Module } from '@nestjs/common';
import { AdvertService } from './advert.service';
import { AdvertController } from './advert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Advert } from 'entities/Advert';
import { AdvertPics } from 'entities/AdvertPics';

@Module({
  imports: [TypeOrmModule.forFeature([Advert, AdvertPics])],
  providers: [AdvertService],
  controllers: [AdvertController],
})
export class AdvertModule {}
