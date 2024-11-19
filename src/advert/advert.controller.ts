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
  AddCommentToAdvertDto,
  AddPictureToAdvertDto,
  CreateAdvertDto as AdvertDto,
  FindAdvertsDto,
  GetAdvertPictureDto,
  ModifyAdvertDto,
  ModifyAdvertPictureDto,
} from './advert.do';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AdvertService } from './advert.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('adverts')
export class AdvertController {
  constructor(private readonly advertsService: AdvertService) {}

  @Get()
  @ApiOperation({
    summary: 'Find advertisements with filters',
    tags: ['adverts'],
  })
  async findAdverts(@Query() dto: FindAdvertsDto) {
    return await this.advertsService.findAdverts(dto);
  }

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

  @Patch(':id')
  @ApiOperation({
    summary: 'Modify an existing advertisemenet',
    tags: ['adverts'],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async modifyAdvert(
    @Param('id') id: number,
    @Body() dto: ModifyAdvertDto,
    @Request() req,
  ) {
    await this.advertsService.modifyAdvert(id, dto, req.user.id);
  }

  @Get(':advertId/pictures')
  @ApiOperation({
    summary: 'Get pictures of an advertisement',
    tags: ['advert pictures'],
  })
  async findPicturesOfAdvert(@Param('advertId') id: number) {
    return await this.advertsService.findPicturesOfAdvert(id);
  }

  @Post(':advertId/pictures')
  @ApiOperation({
    summary: 'Add a new picture to an advertisement',
    tags: ['advert pictures'],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async addPictureToAdvert(
    @Param('advertId') advertId: number,
    @Body() dto: AddPictureToAdvertDto,
    @Request() req,
  ) {
    return {
      id: await this.advertsService.addPictureToAdvert(
        advertId,
        dto,
        req.user.id,
      ),
    };
  }

  @Patch(':advertId/pictures')
  @ApiOperation({
    summary: 'Modify an existing advertisement picture',
    tags: ['advert pictures'],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async modifyAdvertPicture(
    @Param('advertId') advertId: number,
    @Body() dto: ModifyAdvertPictureDto,
    @Request() req,
  ) {
    await this.advertsService.modifyAdvertPicture(advertId, dto, req.user.id);
  }

  @Get(':advertId/comments')
  @ApiOperation({
    summary: 'Get comments of an advertisement',
    tags: ['advert comments'],
  })
  async findCommentsOfAdvert(@Param('advertId') id: number) {
    return await this.advertsService.findCommentsOfAdvert(id);
  }

  @Post(':advertId/comments')
  @ApiOperation({
    summary: 'Add a new comment to an advertisement',
    tags: ['advert comments'],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async addCommentToAdvert(
    @Param('advertId') advertId: number,
    @Body() dto: AddCommentToAdvertDto,
    @Request() req,
  ) {
    return {
      id: await this.advertsService.addCommentToAdvert(
        advertId,
        dto,
        req.user.id,
      ),
    };
  }

  @Get(':advertId/comments/:commentId/replies')
  @ApiOperation({
    summary: 'Get direct replies to a comment',
    tags: ['advert comments'],
  })
  async findRepliesToComment(
    @Param('advertId') advertId: number,
    @Param('commentId') commentId: number,
  ) {
    return await this.advertsService.findRepliesToComment(advertId, commentId);
  }
}
