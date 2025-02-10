import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddBookmarkDto } from './bookmark.dto';
import { Advert } from 'entities/Advert';
import { Bookmark } from 'entities/Bookmark';

@Injectable()
export class BookmarkService {
  @InjectRepository(Bookmark)
  private bookmarkRepository: Repository<Bookmark>;
  @InjectRepository(Advert)
  private advertRepository: Repository<Advert>;

  async getBookmarksOfUser(userId: number) {
    return await this.bookmarkRepository.find({
      where: { userId },
      select: ['userId', 'advertId'],
    });
  }

  async addBookmark(dto: AddBookmarkDto, userId: number): Promise<void> {
    const advert = await this.advertRepository.findOneBy({ id: dto.advertId });
    if (advert == null) {
      throw new BadRequestException('Attemped to add invalid advert id');
    }
    if (
      await this.bookmarkRepository.existsBy({ advertId: dto.advertId, userId })
    ) {
      throw new BadRequestException('Advert is already bookmarked');
    }
    await this.bookmarkRepository.insert({ advertId: dto.advertId, userId });
  }

  async getBookmark(advertId: number, userId: number) {
    const found = await this.bookmarkRepository.findOne({
      where: { advertId, userId },
      select: ['userId', 'advertId'],
    });
    if (found == null) {
      throw new NotFoundException('No such advert id in bookmarks');
    }
    return found;
  }

  async removeBookmark(advertId: number, userId: number) {
    const found = await this.bookmarkRepository.findOneBy({ advertId, userId });
    if (found == null) {
      throw new NotFoundException('No such advert id in bookmarks');
    }
    await this.bookmarkRepository.remove(found);
  }
}
