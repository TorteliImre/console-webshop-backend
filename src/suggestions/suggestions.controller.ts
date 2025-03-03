import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import {
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { HttpExceptionBody, IdResponseDto, PaginatedDto } from 'src/common';
import { CreateSuggestionDto } from './suggestions.dto';
import { Any } from 'typeorm';
import { AdminOnly } from 'src/admin/admin.decorator';

@Controller('suggestions')
export class SuggestionsController {
  constructor(private readonly suggestionsService: SuggestionsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get suggestions',
    tags: ['suggestions'],
  })
  @ApiOkResponse({ type: Any })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  @ApiForbiddenResponse({ type: HttpExceptionBody })
  @AdminOnly()
  @UseGuards(JwtAuthGuard)
  async getSuggestions(@Query() dto: PaginatedDto) {
    return await this.suggestionsService.getSuggestions(dto);
  }

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
