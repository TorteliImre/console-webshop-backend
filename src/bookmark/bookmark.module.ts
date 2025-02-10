import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookmark } from 'entities/Bookmark';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { Advert } from 'entities/Advert';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmark, Advert])],
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}
