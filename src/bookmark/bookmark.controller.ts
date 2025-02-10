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
import { AddBookmarkDto, GetBookmarkResponseDto } from './bookmark.dto';
import { BookmarkService } from './bookmark.service';
import { HttpExceptionBody, IdParamDto, IdResponseDto } from 'src/common';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get()
  @ApiOperation({
    summary: 'Get bookmarks of logged in user',
    tags: ['bookmarks'],
  })
  @ApiOkResponse({ type: GetBookmarkResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ type: HttpExceptionBody })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getOwnBookmarks(@Request() req) {
    return await this.bookmarkService.getBookmarksOfUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a bookmark', tags: ['bookmarks'] })
  @ApiOkResponse({ type: GetBookmarkResponseDto })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  @ApiUnauthorizedResponse({ type: HttpExceptionBody })
  @ApiNotFoundResponse({ type: HttpExceptionBody })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getBookmark(@Param() id: IdParamDto, @Request() req) {
    return await this.bookmarkService.getBookmark(id.id, req.user.id);
  }

  @Post()
  @ApiOperation({
    summary: 'Add an item to the bookmarks',
    tags: ['bookmarks'],
  })
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ type: HttpExceptionBody })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async addBookmark(@Body() dto: AddBookmarkDto, @Request() req) {
    await this.bookmarkService.addBookmark(dto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remove an item from the bookmarks',
    tags: ['bookmarks'],
  })
  @ApiOkResponse()
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  @ApiUnauthorizedResponse({ type: HttpExceptionBody })
  @ApiNotFoundResponse({ type: HttpExceptionBody })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async removeBookmark(@Param() id: IdParamDto, @Request() req) {
    await this.bookmarkService.removeBookmark(id.id, req.user.id);
  }
}
