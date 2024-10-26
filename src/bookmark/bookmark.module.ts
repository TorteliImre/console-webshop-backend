import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookmarks } from 'entities/Bookmarks';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmarks])],
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}
