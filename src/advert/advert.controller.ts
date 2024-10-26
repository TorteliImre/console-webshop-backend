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
  FindAdvertsDto,
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
  @ApiOperation({
    summary: 'Get details of a specific advertisement',
    tags: ['adverts'],
  })
  @ApiOkResponse({ type: AdvertDto })
  async getAdvert(@Param('id') id: number) {
    const found = await this.advertsService.findById(id);
    if (!found) throw new BadRequestException('No such advert');
    return found;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new advertisement', tags: ['adverts'] })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createAdvert(@Body() dto: AdvertDto, @Request() req) {
    return { id: await this.advertsService.createAdvert(dto, req.user.id) };
  }

  @Patch()
  @ApiOperation({
    summary: 'Modify an existing advertisemenet',
    tags: ['adverts'],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async modifyAdvert(@Body() dto: ModifyAdvertDto, @Request() req) {
    await this.advertsService.modifyAdvert(dto, req.user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Find advertisements with filters',
    tags: ['adverts'],
  })
  async findAdverts(@Query() dto: FindAdvertsDto) {
    return await this.advertsService.findAdverts(dto);
  }

  @Get('/pictures/:id')
  @ApiOperation({
    summary: 'Get pictures of an advertisement',
    tags: ['advert pictures'],
  })
  async getAdvertPicture(@Param('id') id: number) {
    return await this.advertsService.findPictureById(id);
  }

  @Post('pictures')
  @ApiOperation({
    summary: 'Add a new picture to an advertisement',
    tags: ['advert pictures'],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async addPictureToAdvert(@Body() dto: AddPictureToAdvertDto, @Request() req) {
    return {
      id: await this.advertsService.addPictureToAdvert(dto, req.user.id),
    };
  }

  @Patch('/pictures')
  @ApiOperation({
    summary: 'Modify an existing advertisement picture',
    tags: ['advert pictures'],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async modifyAdvertPicture(
    @Body() dto: ModifyAdvertPictureDto,
    @Request() req,
  ) {
    await this.advertsService.modifyAdvertPicure(dto, req.user.id);
  }
}
