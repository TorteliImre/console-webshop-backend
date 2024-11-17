import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class AddBookmarkDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  advertId: number;
}
