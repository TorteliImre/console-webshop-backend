import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Suggestion } from 'entities/Suggestion';
import { Repository } from 'typeorm';
import { CreateSuggestionDto } from './suggestions.dto';

@Injectable()
export class SuggestionsService {
  @InjectRepository(Suggestion)
  private suggestionRepository: Repository<Suggestion>;

  async createSuggestion(dto: CreateSuggestionDto, userId: number) {
    const toInsert = dto as any as Suggestion;
    toInsert.userId = userId;

    const result = await this.suggestionRepository.insert(toInsert);
    return result.identifiers[0].id;
  }
}
