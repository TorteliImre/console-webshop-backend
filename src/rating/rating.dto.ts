import { ApiProperty } from '@nestjs/swagger';

export class GetRatingResponseDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  advertId: number;

  @ApiProperty()
  createdTime: string;
}
