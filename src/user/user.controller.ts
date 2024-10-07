import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserService } from './user.service';
import { IsEmail, IsInt, IsNotEmpty } from 'class-validator';

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

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  @ApiOperation({ tags: ['users'] })
  @ApiOkResponse({ type: GetUserDto })
  async getUser(@Param('id') id: number) {
    return await this.userService.findById(id);
  }

  @Post('create')
  @ApiOperation({ tags: ['users'] })
  async createUser(@Body() dto: CreateUserDto) {
    return { id: await this.userService.create(dto) };
  }

  @Post('setBio')
  @ApiOperation({ tags: ['users'] })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async setUserBio(@Body() dto: SetUserBioDto, @Request() req) {
    await this.userService.setUserBio(dto.bio, req.user.id);
  }

  @Post('setPicture')
  @ApiOperation({ tags: ['users'] })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async setUserPicture(@Body() dto: SetUserPicDto, @Request() req) {
    await this.userService.setUserPicture(dto.picture, req.user.id);
  }

  @Post('setPassword')
  @ApiOperation({ tags: ['users'] })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async setUserPassword(@Body() dto: SetUserPassDto, @Request() req) {
    await this.userService.setUserPassword(dto.password, req.user.id);
  }
}
