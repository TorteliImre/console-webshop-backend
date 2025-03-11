import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { Rating } from 'entities/Rating';
import { Purchase } from 'entities/Purchase';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, Purchase])],
  controllers: [RatingController],
  providers: [RatingService],
})
export class RatingModule {}
