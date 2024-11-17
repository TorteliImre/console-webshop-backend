import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookmark } from 'entities/Bookmark';
import { Repository } from 'typeorm';
import { AddBookmarkDto } from './bookmark.dto';

@Injectable()
export class BookmarkService {
  @InjectRepository(Bookmark)
  private bookmarkRepository: Repository<Bookmark>;

  async getBookmarksOfUser(userId: number) {
    return await this.bookmarkRepository.findOneBy({ userId });
  }

  async addBookmark(dto: AddBookmarkDto, userId: number) {
    return (
      await this.bookmarkRepository.insert({ advertId: dto.advertId, userId })
    ).identifiers[0].id;
  }

  async removeBookmark(id: number, userId: number) {
    const found = await this.bookmarkRepository.findOneBy({ id });
    if (found == null) {
      throw new NotFoundException('No such bookmark id');
    }
    if (found.userId != userId) {
      throw new ForbiddenException('Cannot delete bookmark of another user');
    }
    await this.bookmarkRepository.remove(found);
  }
}
