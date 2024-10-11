import { Controller, Post, Query, Request, UseGuards } from '@nestjs/common';
import { CreateAdvertDto } from './advert.do';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdvertService } from './advert.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('advert')
export class AdvertController {
  constructor(private readonly filtersService: AdvertService) {}

  @Post('createAdvert')
  @ApiOperation({ tags: ['adverts'] })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createAdvert(@Query() dto: CreateAdvertDto, @Request() req) {
    return { id: await this.filtersService.createAdvert(dto, req.user.id) };
  }
}
