import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import {
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { HttpExceptionBody, IdResponseDto } from 'src/common';
import { CreateSuggestionDto } from './suggestions.dto';

@Controller('suggestions')
export class SuggestionsController {
  constructor(private readonly suggestionsService: SuggestionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new suggestion', tags: ['suggestions'] })
  @ApiOkResponse({ type: IdResponseDto })
  @ApiUnauthorizedResponse({ type: HttpExceptionBody })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createSuggestion(@Body() dto: CreateSuggestionDto, @Request() req) {
    return {
      id: await this.suggestionsService.createSuggestion(dto, req.user.id),
    };
  }
}
