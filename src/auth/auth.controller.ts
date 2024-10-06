import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CredentialsDto } from './credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Log into a user account',
    tags: ['authentication'],
  })
  logIn(@Body() credentials: CredentialsDto) {
    return this.authService.logIn(credentials.name, credentials.password);
  }
}
