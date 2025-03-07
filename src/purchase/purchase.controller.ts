import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PurchaseService } from './purchase.service';
import { HttpExceptionBody } from 'src/common';
import { GetPurchaseResponseDto } from './purchase.dto';

@Controller('purchases')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Get('bySelf')
  @ApiOperation({
    summary: 'Get purchases made by the logged in user',
    tags: ['purchases'],
  })
  @ApiOkResponse({ type: GetPurchaseResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ type: HttpExceptionBody })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getOwnPurchases(@Request() req) {
    return await this.purchaseService.getPurchasesBy(req.user.id);
  }

  @Get('fromSelf')
  @ApiOperation({
    summary: 'Get purchases made from the logged in user',
    tags: ['purchases'],
  })
  @ApiOkResponse({ type: GetPurchaseResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ type: HttpExceptionBody })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getOwnSold(@Request() req) {
    return await this.purchaseService.getPurchasesFrom(req.user.id);
  }
}
