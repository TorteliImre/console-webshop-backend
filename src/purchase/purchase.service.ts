import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from 'entities/Purchase';

@Injectable()
export class PurchaseService {
  @InjectRepository(Purchase)
  private purchaseRepository: Repository<Purchase>;

  async getPurchasesBy(userId: number) {
    return await this.purchaseRepository.findBy({ userId });
  }

  async getPurchasesFrom(userId: number) {
    let results = await this.purchaseRepository
      .createQueryBuilder('purchase')
      .leftJoin('purchase.advert', 'advert')
      .where('advert.owner = :userId', { userId })
      .getMany();
    return results;
  }

  async _addPurchase(userId: number, advertId: number) {
    let toInsert = new Purchase();
    toInsert.userId = userId;
    toInsert.advertId = advertId;
    this.purchaseRepository.insert(toInsert);
  }
}
