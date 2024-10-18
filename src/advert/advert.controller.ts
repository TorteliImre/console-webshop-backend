import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  AddPictureToAdvertDto,
  CreateAdvertDto as AdvertDto,
} from './advert.do';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AdvertService } from './advert.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('advert')
export class AdvertController {
  constructor(private readonly advertsService: AdvertService) {}

  @Get(':id')
  @ApiOperation({ tags: ['adverts'] })
  @ApiOkResponse({ type: AdvertDto })
  async getAdvert(@Param('id') id: number) {
    const found = await this.advertsService.findById(id);
    if (!found) throw new BadRequestException('No such advert');
    return found;
  }

  @Post('createAdvert')
  @ApiOperation({ tags: ['adverts'] })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createAdvert(@Query() dto: AdvertDto, @Request() req) {
    return { id: await this.advertsService.createAdvert(dto, req.user.id) };
  }

  @Post('addPictureToAdvert')
  @ApiOperation({ tags: ['adverts'] })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async addPictureToAdvert(
    @Query() dto: AddPictureToAdvertDto,
    @Request() req,
  ) {
    return {
      id: await this.advertsService.addPictureToAdvert(dto, req.user.id),
    };
  }
}
