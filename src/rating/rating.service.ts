import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from 'entities/Rating';
import { Repository } from 'typeorm';
import { CreateRatingDto } from './rating.dto';
import { Purchase } from 'entities/Purchase';

@Injectable()
export class RatingService {
  @InjectRepository(Purchase)
  private purchaseRepository: Repository<Purchase>;
  @InjectRepository(Rating)
  private ratingRepository: Repository<Rating>;

  async createRating(dto: CreateRatingDto, userId: number) {
    const purchase = await this.purchaseRepository.findOneBy({
      id: dto.purchaseId,
    });
    if (purchase == null) {
      throw new NotFoundException('No such purchase');
    }
    if (purchase.userId != userId) {
      throw new BadRequestException("Cannot rate another user's purchase");
    }

    let toInsert = new Rating();
    toInsert.purchaseId = dto.purchaseId;
    toInsert.value = dto.value;
    this.ratingRepository.insert(toInsert);
  }
}
