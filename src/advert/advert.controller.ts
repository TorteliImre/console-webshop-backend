import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
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
  CreateAdvertDto,
  FindAdvertsResultDto,
  FindAdvertsDto,
  GetAdvertPictureResultDto,
  ModifyAdvertDto,
  ModifyAdvertPictureDto,
  GetAdvertCommentsResultDto,
  SetPrimaryPictureDto,
  GetAdvertResultItemDto,
} from './advert.do';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AdvertService } from './advert.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  HttpExceptionBody,
  IdParam2Dto,
  IdParamDto,
  IdResponseDto,
  PaginatedDto,
} from 'src/common';

@Controller('adverts')
export class AdvertController {
  constructor(private readonly advertsService: AdvertService) {}

  @Get()
  @ApiOperation({
    summary: 'Find advertisements with filters',
    tags: ['adverts'],
  })
  @ApiOkResponse({ type: FindAdvertsResultDto })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  async findAdverts(@Query() dto: FindAdvertsDto) {
    return await this.advertsService.findAdverts(dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get details of a specific advertisement',
    tags: ['adverts'],
  })
  @ApiOkResponse({ type: GetAdvertResultItemDto })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  @ApiNotFoundResponse({ type: HttpExceptionBody })
  async getAdvert(@Param() id: IdParamDto) {
    return await this.advertsService.findByIdAndIncreaseViewCount(id.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new advertisement', tags: ['adverts'] })
  @ApiOkResponse({ type: IdResponseDto })
  @ApiUnauthorizedResponse({ type: HttpExceptionBody })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createAdvert(@Body() dto: CreateAdvertDto, @Request() req) {
    return { id: await this.advertsService.createAdvert(dto, req.user.id) };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Modify an existing advertisemenet',
    tags: ['adverts'],
  })
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ type: HttpExceptionBody })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  @ApiNotFoundResponse({ type: HttpExceptionBody })
  @ApiForbiddenResponse({ type: HttpExceptionBody })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async modifyAdvert(
    @Param() id: IdParamDto,
    @Body() dto: ModifyAdvertDto,
    @Request() req,
  ) {
    await this.advertsService.modifyAdvert(id.id, dto, req.user.id);
  }

  @Get(':id/pictures')
  @ApiOperation({
    summary: 'Get pictures of an advertisement',
    tags: ['advert pictures'],
  })
  @ApiOkResponse({ type: GetAdvertPictureResultDto, isArray: true })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  @ApiNotFoundResponse({ type: HttpExceptionBody })
  async findPicturesOfAdvert(@Param() id: IdParamDto) {
    return await this.advertsService.findPicturesOfAdvert(id.id);
  }

  @Post(':id/pictures')
  @ApiOperation({
    summary: 'Add a new picture to an advertisement',
    tags: ['advert pictures'],
  })
  @ApiOkResponse({ type: IdResponseDto })
  @ApiUnauthorizedResponse({ type: HttpExceptionBody })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  @ApiNotFoundResponse({ type: HttpExceptionBody })
  @ApiForbiddenResponse({ type: HttpExceptionBody })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async addPictureToAdvert(
    @Param() advertId: IdParamDto,
    @Body() dto: AddPictureToAdvertDto,
    @Request() req,
  ) {
    return {
      id: await this.advertsService.addPictureToAdvert(
        advertId.id,
        dto,
        req.user.id,
      ),
    };
  }

  @Patch(':id/pictures')
  @ApiOperation({
    summary: 'Modify an existing advertisement picture',
    tags: ['advert pictures'],
  })
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ type: HttpExceptionBody })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  @ApiNotFoundResponse({ type: HttpExceptionBody })
  @ApiForbiddenResponse({ type: HttpExceptionBody })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async modifyAdvertPicture(
    @Param() advertId: IdParamDto,
    @Body() dto: ModifyAdvertPictureDto,
    @Request() req,
  ) {
    await this.advertsService.modifyAdvertPicture(
      advertId.id,
      dto,
      req.user.id,
    );
  }

  @Delete(':id1/pictures/:id2')
  @ApiOperation({
    summary: 'Delete an advertisement picture',
    tags: ['advert pictures'],
  })
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ type: HttpExceptionBody })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  @ApiNotFoundResponse({ type: HttpExceptionBody })
  @ApiForbiddenResponse({ type: HttpExceptionBody })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteAdvertPicture(@Param() id: IdParam2Dto, @Request() req) {
    await this.advertsService.deleteAdvertPicture(id.id1, id.id2, req.user.id);
  }

  @Post(':id/primaryPictureId')
  @ApiOperation({
    summary: 'Set which picture is the primary one',
    tags: ['advert pictures'],
  })
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ type: HttpExceptionBody })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  @ApiNotFoundResponse({ type: HttpExceptionBody })
  @ApiForbiddenResponse({ type: HttpExceptionBody })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async setActivePic(
    @Param() advertId: IdParamDto,
    @Body() dto: SetPrimaryPictureDto,
    @Request() req,
  ) {
    await this.advertsService.setPrimaryPicture(
      advertId.id,
      dto.picId,
      req.user.id,
    );
  }

  @Get(':id/primaryPicture')
  @ApiOperation({
    summary: 'Get primary picture of an advertisement',
    tags: ['advert pictures'],
  })
  @ApiOkResponse({ type: GetAdvertPictureResultDto })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  @ApiNotFoundResponse({ type: HttpExceptionBody })
  async getPrimaryPictureOfAdvert(@Param() id: IdParamDto) {
    return await this.advertsService.getPrimaryPictureOfAdvert(id.id);
  }

  @Get(':id/comments')
  @ApiOperation({
    summary: 'Get comments of an advertisement',
    tags: ['advert comments'],
  })
  @ApiOkResponse({ type: GetAdvertCommentsResultDto, isArray: true })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  @ApiNotFoundResponse({ type: HttpExceptionBody })
  async findCommentsOfAdvert(
    @Param() id: IdParamDto,
    @Query() dto: PaginatedDto,
  ) {
    return await this.advertsService.findCommentsOfAdvert(id.id, dto, false);
  }

  @Post(':id/comments')
  @ApiOperation({
    summary: 'Add a new comment to an advertisement',
    tags: ['advert comments'],
  })
  @ApiOkResponse({ type: IdResponseDto })
  @ApiUnauthorizedResponse({ type: HttpExceptionBody })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  @ApiNotFoundResponse({ type: HttpExceptionBody })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async addCommentToAdvert(
    @Param() advertId: IdParamDto,
    @Body() dto: AddCommentToAdvertDto,
    @Request() req,
  ) {
    return {
      id: await this.advertsService.addCommentToAdvert(
        advertId.id,
        dto,
        req.user.id,
      ),
    };
  }

  @Get(':id/comments/direct')
  @ApiOperation({
    summary: 'Get direct comments of an advertisement',
    tags: ['advert comments'],
  })
  @ApiOkResponse({ type: GetAdvertCommentsResultDto, isArray: true })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  @ApiNotFoundResponse({ type: HttpExceptionBody })
  async findDirectCommentsOfAdvert(
    @Param() id: IdParamDto,
    @Query() dto: PaginatedDto,
  ) {
    return await this.advertsService.findCommentsOfAdvert(id.id, dto, true);
  }

  @Get(':id1/comments/:id2/replies')
  @ApiOperation({
    summary: 'Get direct replies to a comment',
    tags: ['advert comments'],
  })
  @ApiOkResponse({ type: GetAdvertCommentsResultDto })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  @ApiNotFoundResponse({ type: HttpExceptionBody })
  async findRepliesToComment(@Param() ids: IdParam2Dto) {
    return await this.advertsService.findRepliesToComment(ids.id1, ids.id2);
  }
}
