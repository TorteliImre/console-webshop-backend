import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { RatingService } from './rating.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Any } from 'typeorm';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { HttpExceptionBody } from 'src/common';
import { CreateRatingDto } from './rating.dto';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  @ApiOperation({
    summary: 'Leave a rating to a purchase',
    tags: ['ratings'],
  })
  @ApiOkResponse({ type: Any })
  @ApiUnauthorizedResponse({ type: HttpExceptionBody })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  @ApiNotFoundResponse({ type: HttpExceptionBody })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createRating(@Body() dto: CreateRatingDto, @Request() req) {
    return await this.ratingService.createRating(dto, req.user.id);
  }
}
