import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthResponseDto, CredentialsDto } from './auth.dto';
import { HttpExceptionBody } from 'src/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Log into a user account',
    tags: ['authentication'],
  })
  @ApiCreatedResponse({ type: AuthResponseDto })
  @ApiUnauthorizedResponse({ type: HttpExceptionBody })
  logIn(@Body() credentials: CredentialsDto) {
    return this.authService.logIn(credentials.name, credentials.password);
  }
}
