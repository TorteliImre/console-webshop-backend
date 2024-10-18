import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AddPictureToAdvertDto, CreateAdvertDto } from './advert.do';
import { InjectRepository } from '@nestjs/typeorm';
import { Advert } from 'entities/Advert';
import { Repository } from 'typeorm';
import { AdvertPics } from 'entities/AdvertPics';

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
    toInsert.data = Buffer.from(dto.picture, 'base64');
    toInsert.description = dto.description;
    const result = await this.advertPicsRepository.insert(toInsert);
    return result.identifiers[0].id;
  }
}
