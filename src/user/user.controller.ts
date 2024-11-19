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
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  CreateUserDto,
  GetUserDto,
  ModifyUserDto,
  SetUserBioDto,
  SetUserPassDto,
  SetUserPicDto,
} from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: 'Get details of the logged in user',
    tags: ['users'],
  })
  @ApiOkResponse({ type: GetUserDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getOwnInfo(@Request() req) {
    return await this.userService.findById(req.user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get details of a specific user',
    tags: ['users'],
  })
  @ApiOkResponse({ type: GetUserDto })
  async getUser(@Param('id') id: number) {
    return await this.userService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Register a new user account', tags: ['users'] })
  async createUser(@Body() dto: CreateUserDto) {
    return { id: await this.userService.create(dto) };
  }

  @Patch()
  @ApiOperation({
    summary: 'Modify details of the logged in user',
    tags: ['users'],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async modifyOwnInfo(@Request() req, @Body() dto: ModifyUserDto) {
    return await this.userService.modifyUser(req.user.id, dto);
  }

  @Post('setBio')
  @ApiOperation({
    summary: "Set the logged in account's bio",
    tags: ['users'],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async setUserBio(@Body() dto: SetUserBioDto, @Request() req) {
    await this.userService.setUserBio(dto.bio, req.user.id);
  }

  @Post('setPicture')
  @ApiOperation({
    summary: "Set the logged in account' picture",
    tags: ['users'],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async setUserPicture(@Body() dto: SetUserPicDto, @Request() req) {
    await this.userService.setUserPicture(dto.picture, req.user.id);
  }

  @Post('setPassword')
  @ApiOperation({
    summary: "Set the logged in account's password",
    tags: ['users'],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async setUserPassword(@Body() dto: SetUserPassDto, @Request() req) {
    await this.userService.setUserPassword(dto.password, req.user.id);
  }
}
