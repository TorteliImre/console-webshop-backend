import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Manufacturers } from 'entities/Manufacturers';
import { ProductStates } from 'entities/ProductStates';

export class GetFiltersResultDto {
  manufacturers: Manufacturers[];
  states: ProductStates[];
}

export class FindLocationsDto {
  @IsNotEmpty()
  @ApiProperty()
  query: string;
}