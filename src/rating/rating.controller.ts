import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { RatingService } from './rating.service';
import {
  ApiBearerAuth,
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

  @Post('bySelf')
  @ApiOperation({
    summary: 'Leave a rating for a purchase',
    tags: ['ratings'],
  })
  @ApiOkResponse({ type: Any })
  @ApiUnauthorizedResponse({ type: HttpExceptionBody })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createRating(@Body() dto: CreateRatingDto, @Request() req) {
    return await this.ratingService.createRating(dto);
  }
}
