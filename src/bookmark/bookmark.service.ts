import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookmarks } from 'entities/Bookmarks';
import { Repository } from 'typeorm';
import { AddBookmarkDto, RemoveBookmarkDto } from './bookmark.dto';

@Injectable()
export class BookmarkService {
  @InjectRepository(Bookmarks)
  private bookmarkRepository: Repository<Bookmarks>;

  async getBookmarksOfUser(userId: number) {
    return await this.bookmarkRepository.findOneBy({ userId });
  }

  async addBookmark(dto: AddBookmarkDto, userId: number) {
    return (
      await this.bookmarkRepository.insert({ advertId: dto.advertId, userId })
    ).identifiers[0].id;
  }

  async removeBookmark(dto: RemoveBookmarkDto, userId: number) {
    const found = await this.bookmarkRepository.findOneBy({
      id: dto.bookmarkId,
    });
    if (found == null) {
      throw new NotFoundException('No such bookmark id');
    }
    if (found.userId != userId) {
      throw new ForbiddenException('Cannot delete bookmark of another user');
    }
    await this.bookmarkRepository.remove(found);
  }
}