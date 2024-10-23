import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  AddPictureToAdvertDto,
  CreateAdvertDto as AdvertDto,
  ModifyAdvertDto,
  ModifyAdvertPictureDto,
} from './advert.do';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AdvertService } from './advert.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('adverts')
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

  @Post()
  @ApiOperation({ tags: ['adverts'] })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createAdvert(@Body() dto: AdvertDto, @Request() req) {
    return { id: await this.advertsService.createAdvert(dto, req.user.id) };
  }

  @Patch()
  @ApiOperation({ tags: ['adverts'] })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async modifyAdvert(@Body() dto: ModifyAdvertDto, @Request() req) {
    await this.advertsService.modifyAdvert(dto, req.user.id);
  }

  @Get('/pictures/:id')
  @ApiOperation({ tags: ['advert pictures'] })
  async getAdvertPicture(@Param('id') id: number) {
    return await this.advertsService.findPictureById(id);
  }

  @Post('pictures')
  @ApiOperation({ tags: ['advert pictures'] })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async addPictureToAdvert(@Body() dto: AddPictureToAdvertDto, @Request() req) {
    return {
      id: await this.advertsService.addPictureToAdvert(dto, req.user.id),
    };
  }

  @Patch('/pictures')
  @ApiOperation({ tags: ['advert pictures'] })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async modifyAdvertPicture(
    @Body() dto: ModifyAdvertPictureDto,
    @Request() req,
  ) {
    await this.advertsService.modifyAdvertPicure(dto, req.user.id);
  }
}
