import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
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
import { PaginatedDto, TransformNumberArray } from '../common';

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

export class GetAdvertResultItemDto extends CreateAdvertDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdTime: Date;

  @ApiPropertyOptional()
  ownerId: number;

  @ApiProperty()
  viewCount: number;

  @ApiProperty()
  isSold: number;
}

export class FindAdvertsResultDto {
  @ApiProperty({ type: [GetAdvertResultItemDto] })
  items: GetAdvertResultItemDto[];

  @ApiProperty()
  resultCount: number;
}

export class ModifyAdvertDto {
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

export enum AdvertsSortBy {
  Title = 'title',
  Owner = 'ownerId',
  PriceHuf = 'priceHuf',
}

export enum AdvertsSortOrder {
  Asc = 'ASC',
  Desc = 'DESC',
}

export class FindAdvertsDto extends PaginatedDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  ownerId: number;

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @TransformNumberArray()
  @Min(1, { each: true })
  modelIds: number[];

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @TransformNumberArray()
  @Min(1, { each: true })
  manufacturerIds: number[];

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @TransformNumberArray()
  @Min(1, { each: true })
  stateIds: number[];

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  locationId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  locationMaxDistance: number;

  @ApiPropertyOptional({ enum: AdvertsSortBy })
  @IsOptional()
  @IsString()
  @IsEnum(AdvertsSortBy)
  sortBy: string;

  @ApiPropertyOptional({ enum: AdvertsSortOrder })
  @IsOptional()
  @IsString()
  @IsEnum(AdvertsSortOrder)
  sortOrder: string;
}

export class AddPictureToAdvertDto {
  @ApiProperty()
  @IsNotEmpty()
  data: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;
}

export class GetAdvertPictureResultDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  data: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  advertId: number;

  @ApiProperty()
  isPrioriy: number;
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

export class SetPrimaryPictureDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  picId: number;
}

export class AddCommentToAdvertDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class GetAdvertCommentsResultDto {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  userId: number;

  @ApiProperty()
  advertId: number;

  @ApiProperty()
  text: string;

  @ApiPropertyOptional()
  replyToId: number;

  @ApiProperty()
  createdTime: Date;
}
