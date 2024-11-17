import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AddCartItemDto } from './cart.dto';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({
    summary: 'Get cart items of logged in user',
    tags: ['cart'],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getOwnCartItems(@Request() req) {
    return await this.cartService.getCartItemsOfUser(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Add an item to the cart', tags: ['cart'] })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async addCartItem(@Body() dto: AddCartItemDto, @Request() req) {
    return { id: await this.cartService.addCartItem(dto, req.user.id) };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove an item from the cart', tags: ['cart'] })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async removeItemFromCart(@Param('id') id: number, @Request() req) {
    await this.cartService.removeCartItem(id, req.user.id);
  }
}
