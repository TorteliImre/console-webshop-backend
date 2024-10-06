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

  @Post('setUserBio')
  @ApiOperation({ tags: ['users'] })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async setUserBio(@Body() dto: SetUserBioDto, @Request() req) {
    if (dto.id != req.user.id) throw new UnauthorizedException('Wrong user id');
    await this.userService.setUserBio(dto);
  }

  @Post('setUserPicture')
  @ApiOperation({ tags: ['users'] })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async setUserPicture(@Body() dto: SetUserPicDto, @Request() req) {
    if (dto.id != req.user.id) throw new UnauthorizedException('Wrong user id');
    await this.userService.setUserPicture(dto);
  }
}
