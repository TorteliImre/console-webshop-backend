import { IsEmail, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

export class GetUserDto {
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
}

export class SetUserBioDto {
  @ApiProperty()
  bio: string;
}

export class SetUserPicDto {
  @ApiProperty()
  picture: string;
}

export class SetUserPassDto {
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
