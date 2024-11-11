import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/User';
import { Repository } from 'typeorm';
import {
  CreateUserDto,
  GetUserDto,
  SetUserBioDto,
  SetUserPicDto,
} from './user.dto';
import * as bcrypt from 'bcrypt';
import sharp from 'sharp';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<number> {
    let passHash = await UserService._hashPass(dto.password);
    let toInsert = new User(dto.name, dto.email, passHash, '2024-11-11'); // TODO
    let result = await this.userRepository.insert(toInsert);
    return result.identifiers[0].id;
  }

  private static async _hashPass(pass: string) {
    return await bcrypt.hash(pass, 10);
  }

  async findById(id: number): Promise<GetUserDto> {
    let found = await this.userRepository.findOne({ where: { id } });
    if (!found) throw new BadRequestException('No such user');
    return found.toGetUserDto();
  }

  async setUserBio(bio: string, id: number): Promise<void> {
    await this.userRepository.update(id, { bio });
  }

  async setUserPicture(picture: string, id: number): Promise<void> {
    let decoded = Buffer.from(picture, 'base64');

    // Check and resize image
    try {
      let img = sharp(decoded);
      await img.stats();
      decoded = await img
        .resize({ fit: 'cover', width: 256, height: 256 })
        .toBuffer();
    } catch (e) {
      throw new BadRequestException(e);
    }

    await this.userRepository.update(id, { picture: decoded });
  }

  async setUserPassword(password: string, id: number): Promise<void> {
    let passwordHash = await UserService._hashPass(password);
    await this.userRepository.update(id, { passwordHash });
  }

  async _getPassHashFromName(name: string): Promise<string | null> {
    return (
      await this.userRepository.findOne({
        where: { name },
        select: ['passwordHash'],
      })
    )?.passwordHash;
  }

  async _getIdFromName(name: string): Promise<number | null> {
    return (
      await this.userRepository.findOne({
        where: { name },
        select: ['id'],
      })
    )?.id;
  }
}
