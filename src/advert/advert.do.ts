import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
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
  @Max(10000000)
  priceHuf: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  stateId: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  manufacturerId: number;

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
    result.manufacturerId = this.manufacturerId;
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
  @Max(10000000)
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
  manufacturerId: number;

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

export class AddPictureToAdvertDto {
  @ApiProperty()
  @IsInt()
  advertId: number;

  @ApiProperty()
  @IsNotEmpty()
  picture: string;

  @ApiPropertyOptional({ nullable: true })
  description: string | null;
}
