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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AddCartItemDto, GetCartItemResponseDto } from './cart.dto';
import { CartService } from './cart.service';
import { HttpExceptionBody, IdParamDto, IdResponseDto } from 'src/common';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({
    summary: 'Get cart items of logged in user',
    tags: ['cart'],
  })
  @ApiOkResponse({ type: GetCartItemResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ type: HttpExceptionBody })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getOwnCartItems(@Request() req) {
    return await this.cartService.getCartItemsOfUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an item from the cart', tags: ['cart'] })
  @ApiOkResponse({ type: GetCartItemResponseDto })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  @ApiUnauthorizedResponse({ type: HttpExceptionBody })
  @ApiNotFoundResponse({ type: HttpExceptionBody })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getCartItem(@Param() id: IdParamDto, @Request() req) {
    return await this.cartService.getCartItem(id.id, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Add an item to the cart', tags: ['cart'] })
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ type: HttpExceptionBody })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async addCartItem(@Body() dto: AddCartItemDto, @Request() req) {
    await this.cartService.addCartItem(dto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove an item from the cart', tags: ['cart'] })
  @ApiOkResponse()
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  @ApiUnauthorizedResponse({ type: HttpExceptionBody })
  @ApiNotFoundResponse({ type: HttpExceptionBody })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async removeItemFromCart(@Param() id: IdParamDto, @Request() req) {
    await this.cartService.removeCartItem(id.id, req.user.id);
  }

  @Post('purchase')
  @ApiOperation({ summary: 'Purchase items', tags: ['cart'] })
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ type: HttpExceptionBody })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  @ApiBearerAuth()
  //@UseGuards(JwtAuthGuard)
  async purchaseItem(@Request() req) {
    //await this.advertsService.purchaseItem(dto, req.user.id);
    await this.cartService.purchaseItems(1);
  }
}
