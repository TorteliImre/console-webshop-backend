import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginatedDto } from 'src/common';
import {
  maxUserBioLength,
  maxUserEmailLength,
  maxUserNameLength,
  maxUserPasswordLength,
} from 'src/limits';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(maxUserNameLength)
  name: string;

  @ApiProperty()
  @IsEmail()
  @MaxLength(maxUserEmailLength)
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(maxUserPasswordLength)
  password: string;
}

export class ModifyUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(maxUserBioLength)
  bio: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  picture: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(maxUserPasswordLength)
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  @MaxLength(maxUserEmailLength)
  email: string;
}

export class FindUsersDto extends PaginatedDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(maxUserNameLength)
  name: string;
}

export class GetUserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  bio: string;

  @ApiProperty({ required: false })
  picture: string;

  @ApiProperty()
  regDate: string;
}

export class GetOwnUserResponseDto extends GetUserResponseDto {
  @ApiProperty()
  email: string;
}

export class FindUsersResponseDto {
  @ApiProperty({ type: [GetUserResponseDto] })
  items: GetUserResponseDto[];

  @ApiProperty()
  resultCount: number;
}

export class SetUserBioDto {
  @ApiProperty()
  @IsString()
  @MaxLength(maxUserBioLength)
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
  @MaxLength(maxUserPasswordLength)
  password: string;
}
