import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
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
import {
  PaginatedDto,
  TransformBoolean,
  TransformNumberArray,
} from '../common';
import {
  maxAdvertDescriptionLength,
  maxAdvertPicDescriptionLength,
  maxAdvertPrice,
  maxAdvertTitleLength,
  maxCommentLength,
} from 'src/limits';

export class CreateAdvertDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(maxAdvertTitleLength)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(maxAdvertDescriptionLength)
  description: string;

  @ApiProperty()
  @IsInt()
  locationId: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(maxAdvertPrice)
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
  @MaxLength(maxAdvertTitleLength)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(maxAdvertDescriptionLength)
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  locationId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(maxAdvertPrice)
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

export class IsAdvertInCartResultDto {
  @ApiProperty()
  result: boolean;
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
  @MaxLength(maxAdvertTitleLength)
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
  @Max(maxAdvertPrice)
  priceHufMin: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(maxAdvertPrice)
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

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  @TransformBoolean('includePurchased')
  includePurchased: boolean;
}

export class AddPictureToAdvertDto {
  @ApiProperty()
  @IsNotEmpty()
  data: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(maxAdvertPicDescriptionLength)
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
  @MaxLength(maxAdvertPicDescriptionLength)
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
  @MaxLength(maxCommentLength)
  text: string;
}

export class AdvertCommentDto {
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

  @ApiProperty()
  replyCount: number;
}

export class GetAdvertCommentsResultDto {
  @ApiProperty({ type: [AdvertCommentDto] })
  items: AdvertCommentDto[];

  @ApiProperty()
  resultCount: number;
}

export class PurchaseDto {
  @ApiProperty()
  advertId: number;
}
