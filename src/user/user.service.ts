import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/User';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import {
  CreateUserDto,
  FindUsersDto,
  FindUsersResponseDto,
  GetUserResponseDto,
  ModifyUserDto,
  SetUserBioDto,
  SetUserPicDto,
} from './user.dto';
import * as bcrypt from 'bcrypt';
import sharp from 'sharp';

function getIsoDate(): string {
  return new Date().toISOString().split('T')[0];
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<number> {
    if (await this.userRepository.existsBy({ name: dto.name })) {
      throw new BadRequestException('Username is taken');
    }
    let passHash = await UserService._hashPass(dto.password);
    let toInsert = new User(dto.name, dto.email, passHash, getIsoDate());
    let result = await this.userRepository.insert(toInsert);
    return result.identifiers[0].id;
  }

  private static async _hashPass(pass: string) {
    return await bcrypt.hash(pass, 10);
  }

  async findById(id: number): Promise<GetUserResponseDto> {
    let found = await this.userRepository.findOne({ where: { id } });
    if (!found) throw new NotFoundException('No such user');
    return found.toGetUserDto();
  }

  async find(dto: FindUsersDto): Promise<FindUsersResponseDto> {
    let where: FindOptionsWhere<User> = {};
    where.name = dto.name ? ILike(`%${dto.name}%`) : undefined;

    const found = (
      await this.userRepository.find({
        where,
        skip: dto.skip,
        take: dto.count,
      })
    ).map((x) => x.toGetUserDto());
    const resultCount = await this.userRepository.count({ where });

    let output = new FindUsersResponseDto();
    output.items = found as any;
    output.resultCount = resultCount;
    return output;
  }

  async modifyUser(id: number, dto: ModifyUserDto) {
    if (dto.bio != null && dto.bio != undefined) this.setUserBio(dto.bio, id);
    if (dto.picture != null && dto.picture != undefined)
      this.setUserPicture(dto.picture, id);
    if (dto.password != null && dto.password != undefined)
      this.setUserPassword(dto.password, id);
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
