import { ApiProperty } from '@nestjs/swagger';

export class GetPurchaseResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  advertId: number;

  @ApiProperty()
  createdTime: string;

  @ApiProperty()
  rating: number;
}
