import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/User';
import { Repository } from 'typeorm';
import { CreateUserDto, GetUserDto } from './user.controller';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<number> {
    let passHash = await bcrypt.hash(dto.password, 10);
    let toInsert = new User(dto.name, dto.email, passHash);
    let result = await this.userRepository.insert(toInsert);
    return result.identifiers[0].id;
  }

  async findById(id: number): Promise<GetUserDto> {
    let found = await this.userRepository.findOne({ where: { id } });
    if (!found) throw new BadRequestException('No such user');
    return found.toGetUserDto();
  }
}
