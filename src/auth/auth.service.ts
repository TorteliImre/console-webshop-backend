import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async logIn(username: string, password: string) {
    const hash = await this.usersService._getPassHashFromName(username);
    if (hash == null) {
      throw new UnauthorizedException('No such user');
    }
    if (!(await bcrypt.compare(password, hash))) {
      throw new UnauthorizedException('Invalid password');
    }

    const userId = await this.usersService._getIdFromName(username);
    console.log(userId);

    return {
      access_token: await this.jwtService.signAsync(
        { username, id: userId },
        { secret: jwtConstants.secret },
      ),
    };
  }
}
