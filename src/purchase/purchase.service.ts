import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from 'entities/Purchase';
import { GetPurchaseResponseDto } from './purchase.dto';

@Injectable()
export class PurchaseService {
  @InjectRepository(Purchase)
  private purchaseRepository: Repository<Purchase>;

  async getPurchasesBy(userId: number) {
    const results = await this.purchaseRepository.find({
      where: { userId },
      select: ['id', 'userId', 'advertId', 'createdTime'],
      relations: ['rating'],
    });
    for (let res of results) {
      const rating = res.rating;
      (res as any).rating = rating == null ? null : rating.value;
    }
    return results as any as Array<GetPurchaseResponseDto>;
  }

  async getPurchasesFrom(userId: number) {
    const results = await this.purchaseRepository
      .createQueryBuilder('purchase')
      .leftJoin('purchase.advert', 'advert')
      .leftJoinAndSelect('purchase.rating', 'rating')
      .where('advert.owner = :userId', { userId })
      .addSelect('purchase.id')
      .addSelect('purchase.userId')
      .addSelect('purchase.advertId')
      .addSelect('purchase.createdTime')
      .getMany();
    for (let res of results) {
      const rating = res.rating;
      (res as any).rating = rating == null ? null : rating.value;
    }
    return results as any as Array<GetPurchaseResponseDto>;
  }

  async _addPurchase(userId: number, advertId: number) {
    let toInsert = new Purchase();
    toInsert.userId = userId;
    toInsert.advertId = advertId;
    this.purchaseRepository.insert(toInsert);
  }
}
