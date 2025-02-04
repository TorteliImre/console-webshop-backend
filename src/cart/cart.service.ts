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

@Injectable()
export class CartService {
  @InjectRepository(CartItem)
  private cartItemRepository: Repository<CartItem>;

  async getCartItemsOfUser(userId: number) {
    return await this.cartItemRepository.find({
      where: { userId },
      select: ['userId', 'advertId'],
    });
  }

  async addCartItem(dto: AddCartItemDto, userId: number): Promise<void> {
    if (
      await this.cartItemRepository.existsBy({ advertId: dto.advertId, userId })
    ) {
      throw new BadRequestException('Advert is already in the cart');
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
}
