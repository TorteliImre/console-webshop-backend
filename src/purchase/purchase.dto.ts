import { ApiProperty } from '@nestjs/swagger';

export class GetPurchaseResponseDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  advertId: number;

  @ApiProperty()
  createdTime: string;
}
