import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AddPictureToAdvertDto,
  CreateAdvertDto,
  ModifyAdvertDto,
  ModifyAdvertPictureDto,
} from './advert.do';
import { InjectRepository } from '@nestjs/typeorm';
import { Advert } from 'entities/Advert';
import { Repository } from 'typeorm';
import { AdvertPics } from 'entities/AdvertPics';
import assert from 'assert';

@Injectable()
export class AdvertService {
  @InjectRepository(Advert)
  private advertRepository: Repository<Advert>;
  @InjectRepository(AdvertPics)
  private advertPicsRepository: Repository<AdvertPics>;

  async findById(id: number) {
    return await this.advertRepository.findOneBy({ id });
  }

  async createAdvert(dto: CreateAdvertDto, userId: number) {
    let toInsert = dto.toEntity();
    toInsert.ownerId = userId;
    let result = await this.advertRepository.insert(toInsert);
    return result.identifiers[0].id;
  }

  async modifyAdvert(dto: ModifyAdvertDto, userId: number) {
    let found = await this.advertRepository.findOneBy({ id: dto.id });
    if (found == null) {
      throw new NotFoundException('No such advertisement id');
    }
    if (found.ownerId != userId) {
      throw new UnauthorizedException(
        'Cannot modify advertisement of another user',
      );
    }
    await this.advertRepository.update(dto.id, dto);
  }

  async addPictureToAdvert(dto: AddPictureToAdvertDto, userId: number) {
    const advertOwner: number | null = (
      await this.advertRepository.findOne({
        where: { id: dto.advertId },
        select: { ownerId: true },
      })
    )?.ownerId;
    if (advertOwner == null) {
      throw new NotFoundException('No such advertisement');
    }
    if (advertOwner != userId) {
      throw new UnauthorizedException(
        'Cannot modify advertisement of another user',
      );
    }

    const toInsert = new AdvertPics();
    toInsert.advertId = dto.advertId;
    toInsert.data = Buffer.from(dto.data, 'base64');
    toInsert.description = dto.description;
    const result = await this.advertPicsRepository.insert(toInsert);
    return result.identifiers[0].id;
  }

  async findPictureById(id: number) {
    const found = await this.advertPicsRepository.findOneBy({ id });
    if (!found) throw new BadRequestException('No such advert picture');
    return found;
  }

  async modifyAdvertPicure(dto: ModifyAdvertPictureDto, userId: number) {
    const pic = await this.advertPicsRepository.findOneBy({ id: dto.id });
    if (pic == null) {
      throw new NotFoundException('No such advertisement picture id');
    }

    const advert = await this.advertRepository.findOneBy({ id: pic.advertId });
    assert(advert != null);
    if (advert.ownerId != userId) {
      throw new ForbiddenException(
        'Cannot modify advertisement of another user',
      );
    }

    const toUpdate = { ...dto } as any;
    toUpdate.data = Buffer.from(dto.data, 'base64');
    this.advertPicsRepository.update(dto.id, toUpdate);
  }
}
