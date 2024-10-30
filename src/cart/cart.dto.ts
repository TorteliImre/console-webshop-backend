import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class AddCartItemDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  advertId: number;
}

export class RemoveCartItemDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  cartItemId: number;
}
