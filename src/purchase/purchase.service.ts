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
      select: ['advertId', 'userId', 'createdTime'],
    });
    return results as any as Array<GetPurchaseResponseDto>;
  }

  async getPurchasesFrom(userId: number) {
    const results = await this.purchaseRepository
      .createQueryBuilder('purchase')
      .leftJoin('purchase.advert', 'advert')
      .where('advert.owner = :userId', { userId })
      .select('purchase.userId')
      .addSelect('purchase.advertId')
      .addSelect('purchase.createdTime')
      .getMany();
    return results as any as Array<GetPurchaseResponseDto>;
  }

  async _addPurchase(userId: number, advertId: number) {
    let toInsert = new Purchase();
    toInsert.userId = userId;
    toInsert.advertId = advertId;
    this.purchaseRepository.insert(toInsert);
  }
}
