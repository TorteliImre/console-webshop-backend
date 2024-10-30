import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Advert } from 'entities/Advert';

export const priceHufMax = 10000000;

export class CreateAdvertDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  @ApiProperty()
  @IsInt()
  locationId: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(priceHufMax)
  priceHuf: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  stateId: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  modelId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  revision: string;

  toEntity(): Advert {
    let result = new Advert();
    result.title = this.title;
    result.description = this.description;
    result.locationId = this.locationId;
    result.priceHuf = this.priceHuf;
    result.stateId = this.stateId;
    result.modelId = this.modelId;
    result.revision = this.revision ?? '';
    return result;
  }
}

export class ModifyAdvertDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  locationId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(priceHufMax)
  priceHuf: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  stateId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  modelId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  revision: string;
}

export class FindAdvertsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  ownerId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  modelId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  revision: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  stateId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  locationId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(priceHufMax)
  priceHufMin: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(priceHufMax)
  priceHufMax: number;
}

export class AddPictureToAdvertDto {
  @ApiProperty()
  @IsInt()
  advertId: number;

  @ApiProperty()
  @IsNotEmpty()
  data: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;
}

export class GetAdvertPictureDto {
  @ApiProperty()
  @IsInt()
  advertId: number;

  @ApiProperty()
  @IsNotEmpty()
  data: string;

  @ApiPropertyOptional()
  @IsString()
  description: string;
}

export class ModifyAdvertPictureDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  data: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;
}
