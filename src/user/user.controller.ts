import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiOkResponse, ApiProperty } from '@nestjs/swagger';
import { UserService } from './user.service';

export class CreateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
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
  id: number;

  @ApiProperty()
  bio: string;
}

export class SetUserPicDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  picture: string;
}

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {
  }

  @Get(':id')
  @ApiOkResponse({ type: GetUserDto })
  async getUser(@Param('id') id: number) {
    console.log(id);
    return new GetUserDto();
  }

  @Post('create')
  async createUser(@Body() dto: CreateUserDto) {
    console.log(dto);
  }

  @Post('setUserBio')
  async setUserBio(@Body() dto: SetUserBioDto) {
    console.log(dto);
  }

  @Post('setUserPicture')
  async setUserPicture(@Body() dto: SetUserPicDto) {
    console.log(dto);
  }
}
