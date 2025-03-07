import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from 'entities/Rating';
import { Repository } from 'typeorm';

@Injectable()
export class RatingService {
  @InjectRepository(Rating)
  private ratingRepository: Repository<Rating>;
}
