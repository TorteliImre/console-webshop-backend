import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'entities/CartItem';
import { Repository } from 'typeorm';
import { AddCartItemDto, RemoveCartItemDto } from './cart.dto';

@Injectable()
export class CartService {
  @InjectRepository(CartItem)
  private cartItemRepository: Repository<CartItem>;

  async getCartItemsOfUser(userId: number) {
    return await this.cartItemRepository.findOneBy({ userId });
  }

  async addCartItem(dto: AddCartItemDto, userId: number) {
    return (
      await this.cartItemRepository.insert({ advertId: dto.advertId, userId })
    ).identifiers[0].id;
  }

  async removeCartItem(dto: RemoveCartItemDto, userId: number) {
    const found = await this.cartItemRepository.findOneBy({
      id: dto.cartItemId,
    });
    if (found == null) {
      throw new NotFoundException('No such cart item id');
    }
    if (found.userId != userId) {
      throw new ForbiddenException('Cannot delete cart item of another user');
    }
    await this.cartItemRepository.remove(found);
  }
}