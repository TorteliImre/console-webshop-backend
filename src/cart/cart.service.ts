import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'entities/CartItem';
import { Repository } from 'typeorm';
import { AddCartItemDto } from './cart.dto';
import { Advert } from 'entities/Advert';
import { AdvertService } from 'src/advert/advert.service';
import { PurchaseService } from 'src/purchase/purchase.service';

@Injectable()
export class CartService {
  @InjectRepository(CartItem)
  private cartItemRepository: Repository<CartItem>;
  @InjectRepository(Advert)
  private advertRepository: Repository<Advert>;

  constructor(
    private advertService: AdvertService,
    private purchaseService: PurchaseService,
  ) {}

  async getCartItemsOfUser(userId: number) {
    return await this.cartItemRepository.find({
      where: { userId },
      select: ['userId', 'advertId'],
    });
  }

  async addCartItem(dto: AddCartItemDto, userId: number): Promise<void> {
    const advert = await this.advertRepository.findOneBy({ id: dto.advertId });
    if (advert == null) {
      throw new BadRequestException('Attemped to add invalid advert id');
    }
    if (advert.ownerId == userId) {
      throw new BadRequestException('Attemped to add own advert to cart');
    }
    if (
      await this.cartItemRepository.existsBy({ advertId: dto.advertId, userId })
    ) {
      throw new BadRequestException('Advert is already in the cart');
    }
    if (await this.advertService._isItemSold(dto.advertId)) {
      throw new BadRequestException('Item has already been sold');
    }
    await this.cartItemRepository.insert({ advertId: dto.advertId, userId });
  }

  async getCartItem(advertId: number, userId: number) {
    const found = await this.cartItemRepository.findOne({
      where: { advertId, userId },
      select: ['userId', 'advertId'],
    });
    if (found == null) {
      throw new NotFoundException('No such advert id in cart');
    }
    return found;
  }

  async removeCartItem(advertId: number, userId: number) {
    const found = await this.cartItemRepository.findOneBy({ advertId, userId });
    if (found == null) {
      throw new NotFoundException('No such advert id in cart');
    }
    await this.cartItemRepository.remove(found);
  }

  async purchaseItems(userId: number) {
    const items = await this.cartItemRepository.findBy({ userId });

    let itemsToBuy: CartItem[] = [];
    for (const item of items) {
      if (!(await this.advertService._isItemSold(item.advertId))) {
        itemsToBuy.push(item);
      }
    }

    if (itemsToBuy.length == 0) {
      throw new BadRequestException('There are no items to purchase');
    }

    for (let item of itemsToBuy) {
      await this.advertRepository.update(
        { id: item.advertId },
        { isSold: true },
      );

      await this.purchaseService._addPurchase(userId, item.advertId);
    }

    await this.cartItemRepository.remove(items);
  }
}
