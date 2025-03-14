import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Max, Min } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty()
  @IsNumber()
  @Min(0.5)
  @Max(5)
  value: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  purchaseId: number;
}
