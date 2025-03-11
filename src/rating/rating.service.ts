import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from 'entities/Rating';
import { Repository } from 'typeorm';
import { CreateRatingDto } from './rating.dto';

@Injectable()
export class RatingService {
  @InjectRepository(Rating)
  private ratingRepository: Repository<Rating>;

  async createRating(dto: CreateRatingDto) {
    let toInsert = new Rating();
    toInsert.purchaseId = dto.purchaseId;

    this.ratingRepository.insert(toInsert);
  }
}
