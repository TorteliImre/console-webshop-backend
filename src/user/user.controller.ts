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
  BadRequestException,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  CreateUserDto,
  FindUsersDto,
  FindUsersResponseDto,
  GetOwnUserResponseDto,
  GetUserResponseDto,
  ModifyUserDto,
  SetUserBioDto,
  SetUserPassDto,
  SetUserPicDto,
} from './user.dto';
import { UserService } from './user.service';
import { HttpExceptionBody, IdParamDto, IdResponseDto } from 'src/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // TODO: Rename to "/self"
  @Get()
  @ApiOperation({
    summary: 'Get details of the logged in user',
    tags: ['users'],
  })
  @ApiOkResponse({ type: GetOwnUserResponseDto })
  @ApiUnauthorizedResponse({ type: HttpExceptionBody })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getOwnInfo(@Request() req) {
    return await this.userService.findSelfById(req.user.id);
  }

  // TODO: Rename to ""
  @Get('/find')
  @ApiOperation({
    summary: 'Find users',
    tags: ['users'],
  })
  @ApiOkResponse({ type: FindUsersResponseDto })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  async findUsers(@Query() dto: FindUsersDto) {
    return await this.userService.find(dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get details of a specific user',
    tags: ['users'],
  })
  @ApiOkResponse({ type: GetUserResponseDto })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  @ApiNotFoundResponse({ type: HttpExceptionBody })
  async getUser(@Param() id: IdParamDto) {
    return await this.userService.findById(id.id);
  }

  @Post()
  @ApiOperation({ summary: 'Register a new user account', tags: ['users'] })
  @ApiOkResponse({ type: IdResponseDto })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  async createUser(@Body() dto: CreateUserDto) {
    return { id: await this.userService.create(dto) };
  }

  @Patch()
  @ApiOperation({
    summary: 'Modify details of the logged in user',
    tags: ['users'],
  })
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ type: HttpExceptionBody })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
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
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ type: HttpExceptionBody })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
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
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ type: HttpExceptionBody })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
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
  @ApiOkResponse()
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  @ApiUnauthorizedResponse({ type: HttpExceptionBody })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async setUserPassword(@Body() dto: SetUserPassDto, @Request() req) {
    await this.userService.setUserPassword(dto.password, req.user.id);
  }
}
