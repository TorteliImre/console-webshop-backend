import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsObject } from 'class-validator';
import { Manufacturer } from 'entities/Manufacturer';
import { ProductState } from 'entities/ProductState';
import { isTypedArray } from 'util/types';

export class GetManufacturersResultDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

export class GetProductStatesResultDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

export class GetFiltersResultDto {
  @ApiProperty({ type: GetManufacturersResultDto, isArray: true })
  manufacturers: GetManufacturersResultDto[];

  @ApiProperty({ type: GetProductStatesResultDto, isArray: true })
  states: GetProductStatesResultDto[];
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

export class GetManufacturerForModelDto {
  @ApiProperty()
  @IsNotEmpty()
  modelId: number;
}

export class GetModelResultDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  manufacturerId: number;
}

export class GetLocationsResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  county: string;

  @ApiProperty()
  zip: number;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;
}
