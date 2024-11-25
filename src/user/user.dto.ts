import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class ModifyUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  picture: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  password: string;
}

export class GetUserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  bio: string;

  @ApiProperty({ required: false })
  picture: string;

  @ApiProperty()
  regDate: string;
}

export class SetUserBioDto {
  @ApiProperty()
  @IsString()
  bio: string;
}

export class SetUserPicDto {
  @ApiProperty()
  @IsString()
  picture: string;
}

export class SetUserPassDto {
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
