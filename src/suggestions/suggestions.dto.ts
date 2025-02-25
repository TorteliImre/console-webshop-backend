import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { maxSuggestionTextLength, maxSuggestionTitleLength } from 'src/limits';

export class CreateSuggestionDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(maxSuggestionTitleLength)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(maxSuggestionTextLength)
  text: string;
}
