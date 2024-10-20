import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsObject } from 'class-validator';
import { Manufacturers } from 'entities/Manufacturers';
import { ProductStates } from 'entities/ProductStates';
import { isTypedArray } from 'util/types';

export class ManufacturerDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

export class ProductStateDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

export class GetFiltersResultDto {
  @ApiProperty({ type: ManufacturerDto, isArray: true })
  manufacturers: ManufacturerDto[];

  @ApiProperty({ type: ProductStateDto, isArray: true })
  states: ProductStateDto[];
}

export class FindLocationsDto {
  @ApiProperty()
  @IsNotEmpty()
  query: string;
}

export class GetModelsForManufacturerDto {
  @ApiProperty()
  @IsNotEmpty()
  manufacturerId: number;
}

export class ModelDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  manufacturerId: number;
}

export class LocationDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  zip: number;

  @ApiProperty()
  name: string;
}
