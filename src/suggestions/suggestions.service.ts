import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Suggestion } from 'entities/Suggestion';
import { Repository } from 'typeorm';
import {
  CreateSuggestionDto,
  GetSuggestionsItemDto,
  GetSuggestionsResultDto,
} from './suggestions.dto';
import { PaginatedDto } from 'src/common';

@Injectable()
export class SuggestionsService {
  @InjectRepository(Suggestion)
  private suggestionRepository: Repository<Suggestion>;

  async getSuggestions(dto: PaginatedDto) {
    let result = new GetSuggestionsResultDto();

    const count = await this.suggestionRepository.count();
    const items = await this.suggestionRepository.find({
      skip: dto.skip,
      take: dto.count,
      select: ['title', 'text', 'createdTime', 'userId'],
    });

    result.resultCount = count;
    result.items = items as any as Array<GetSuggestionsItemDto>;

    return result;
  }

  async createSuggestion(dto: CreateSuggestionDto, userId: number) {
    const toInsert = dto as any as Suggestion;
    toInsert.userId = userId;

    const result = await this.suggestionRepository.insert(toInsert);
    return result.identifiers[0].id;
  }
}
