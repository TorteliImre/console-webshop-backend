import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsInt, Max, Min } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty()
  @IsDecimal()
  @Min(1)
  @Max(5)
  value: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  purchaseId: number;
}
