import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AddBookmarkDto, RemoveBookmarkDto } from './bookmark.dto';
import { BookmarkService } from './bookmark.service';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get()
  @ApiOperation({
    summary: 'Get bookmarks of logged in user',
    tags: ['bookmarks'],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getOwnBookmarks(@Request() req) {
    return await this.bookmarkService.getBookmarksOfUser(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new bookmark', tags: ['bookmarks'] })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async addBookmark(@Body() dto: AddBookmarkDto, @Request() req) {
    return { id: await this.bookmarkService.addBookmark(dto, req.user.id) };
  }

  @Delete()
  @ApiOperation({ summary: 'Delete a bookmark', tags: ['bookmarks'] })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async removeBookmark(@Body() dto: RemoveBookmarkDto, @Request() req) {
    await this.bookmarkService.removeBookmark(dto, req.user.id);
  }
}
