import { Module } from '@nestjs/common';
import { SuggestionsController } from './suggestions.controller';
import { SuggestionsService } from './suggestions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Suggestion } from 'entities/Suggestion';

@Module({
  imports: [TypeOrmModule.forFeature([Suggestion])],
  controllers: [SuggestionsController],
  providers: [SuggestionsService],
})
export class SuggestionsModule {}
