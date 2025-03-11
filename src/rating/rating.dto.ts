import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty()
  value: number;

  @ApiProperty()
  createdTime: Date;

  @ApiProperty()
  @IsInt()
  @Min(1)
  purchaseId: number;
}
