import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AddPictureToAdvertDto,
  CreateAdvertDto,
  FindAdvertsDto,
  ModifyAdvertDto,
  ModifyAdvertPictureDto,
  priceHufMax,
} from './advert.do';
import { InjectRepository } from '@nestjs/typeorm';
import { Advert } from 'entities/Advert';
import { Between, FindOptionsWhere, ILike, In, Repository } from 'typeorm';
import { AdvertPics } from 'entities/AdvertPics';
import sharp from 'sharp';

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
      throw new ForbiddenException(
        'Cannot modify advertisement of another user',
      );
    }
    await this.advertRepository.update(dto.id, dto);
  }

  async findAdverts(dto: FindAdvertsDto) {
    let where: FindOptionsWhere<Advert>;
    where.title = dto.title ? ILike(`%${dto.title}%`) : undefined;
    where.ownerId = dto.ownerId ?? undefined;
    where.modelId = dto.modelIds ? In(dto.modelIds) : undefined;
    where.stateId = dto.stateIds ? In(dto.stateIds) : undefined;
    where.priceHuf =
      dto.priceHufMin || dto.priceHufMax
        ? Between(dto.priceHufMin ?? 0, dto.priceHufMax ?? priceHufMax)
        : undefined;

    const found = await this.advertRepository.findBy(where);
    return found;
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
      throw new ForbiddenException(
        'Cannot modify advertisement of another user',
      );
    }

    const toInsert = new AdvertPics();
    toInsert.advertId = dto.advertId;
    toInsert.data = Buffer.from(dto.data, 'base64');
    toInsert.description = dto.description;

    // Check and resize image
    try {
      let img = sharp(toInsert.data);
      await img.stats();
      toInsert.data = await img
        .resize({
          width: 1920,
          height: 1080,
          fit: 'inside',
          withoutEnlargement: false,
        })
        .toBuffer();
    } catch (e) {
      throw new BadRequestException(e);
    }

    const result = await this.advertPicsRepository.insert(toInsert);
    return result.identifiers[0].id;
  }

  async findPicturesOfAdvert(id: number) {
    const found = await this.advertPicsRepository.findBy({ advertId: id });
    let toReturn = [];
    for (let original of found) {
      let transformed = { ...original } as any;
      transformed.data = original.data.toString('base64');
      toReturn.push(transformed);
    }
    return toReturn;
  }

  async modifyAdvertPicure(dto: ModifyAdvertPictureDto, userId: number) {
    let pic = await this.advertPicsRepository.findOneBy({ id: dto.id });
    if (pic == null) {
      throw new NotFoundException('No such advertisement picture id');
    }

    const advert = await this.advertRepository.findOneBy({ id: pic.advertId });
    if (advert == null) {
      throw new Error("BUG: pic.advertId should NEVER point to a non-existent row");
    }

    if (advert.ownerId != userId) {
      throw new ForbiddenException(
        'Cannot modify advertisement of another user',
      );
    }

    pic.data = dto.data == null ? pic.data : Buffer.from(dto.data, 'base64');
    pic.description = dto.description ?? pic.description;

    this.advertPicsRepository.update(dto.id, pic);
  }
}
