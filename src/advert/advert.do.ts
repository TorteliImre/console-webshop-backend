import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  MaxLength,
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
  priceHuf: number;

  @ApiProperty()
  @IsInt()
  stateId: number;

  @ApiProperty()
  @IsInt()
  manufacturerId: number;

  @ApiProperty()
  @IsInt()
  modelId: number;

  @ApiPropertyOptional()
  revision: string | null;

  toEntity(): Advert {
    let result = new Advert();
    result.title = this.title;
    result.description = this.description;
    result.locationId = this.locationId;
    result.priceHuf = this.priceHuf;
    result.stateId = this.stateId;
    result.manufacturerId = this.manufacturerId;
    result.modelId = this.modelId;
    result.revision = this.revision;
    return result;
  }
}

export class AddPictureToAdvertDto {
  @ApiProperty()
  @IsInt()
  advertId: number;

  @ApiProperty()
  @IsNotEmpty()
  picture: string;

  @ApiProperty({ nullable: true, required: false })
  @IsNotEmpty()
  description: string | null;
}
