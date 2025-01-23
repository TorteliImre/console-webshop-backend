import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AddCommentToAdvertDto,
  AddPictureToAdvertDto,
  CreateAdvertDto,
  FindAdvertsDto,
  FindAdvertsResultDto,
  ModifyAdvertDto,
  ModifyAdvertPictureDto,
  priceHufMax,
} from './advert.do';
import { InjectRepository } from '@nestjs/typeorm';
import { Advert } from 'entities/Advert';
import {
  Between,
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
  In,
  Repository,
} from 'typeorm';
import { AdvertPic } from 'entities/AdvertPic';
import sharp from 'sharp';
import { Comment } from 'entities/Comment';
import { Location } from 'entities/Location';
import { Model } from '../../entities/Model';
import { PaginatedDto } from 'src/common';

@Injectable()
export class AdvertService {
  @InjectRepository(Advert)
  private advertRepository: Repository<Advert>;
  @InjectRepository(AdvertPic)
  private advertPicsRepository: Repository<AdvertPic>;
  @InjectRepository(Comment)
  private advertCommentsRepository: Repository<Comment>;
  @InjectRepository(Location)
  private locationRepository: Repository<Location>;
  @InjectRepository(Model)
  private modelRepository: Repository<Model>;

  async findById(id: number) {
    const found = await this.advertRepository.findOneBy({ id });
    if (!found) throw new NotFoundException('No such advert');
    return found;
  }

  async findByIdAndIncreaseViewCount(id: number) {
    const found = await this.findById(id);
    this.advertRepository.update(id, { viewCount: () => 'viewCount + 1' });
    ++found.viewCount;
    return found;
  }

  async createAdvert(dto: CreateAdvertDto, userId: number) {
    let toInsert = dto.toEntity();
    toInsert.ownerId = userId;
    let result = await this.advertRepository.insert(toInsert);
    return result.identifiers[0].id;
  }

  async modifyAdvert(id: number, dto: ModifyAdvertDto, userId: number) {
    let found = await this.advertRepository.findOneBy({ id });
    if (found == null) {
      throw new NotFoundException('No such advertisement id');
    }
    if (found.ownerId != userId) {
      throw new ForbiddenException(
        'Cannot modify advertisement of another user',
      );
    }
    await this.advertRepository.update(id, dto);
  }

  async _findLocationIdsInArea(
    lat: number,
    long: number,
    maxDist: number,
  ): Promise<Array<number>> {
    const results = (
      (await this.locationRepository
        .createQueryBuilder()
        .addSelect('id')
        .addSelect(
          `
            3959 * acos (
              cos ( radians(${lat}) )
              * cos( radians( latitude ) )
              * cos( radians( longitude ) - radians(${long}) )
              + sin ( radians(${lat}) )
              * sin( radians( latitude ) )
            )
          `,
          'distance',
        )
        .having('distance <= :maxDist', { maxDist })
        .getRawMany()) as Array<Location>
    ).map((x) => x.id);
    return results;
  }

  async _findModelIdsOfManufacturer(manufacturerId: number) {
    return (
      await this.modelRepository.find({
        where: {
          manufacturerId: manufacturerId,
        },
        select: ['id'],
      })
    ).map((x) => x.id);
  }

  async findAdverts(dto: FindAdvertsDto): Promise<FindAdvertsResultDto> {
    let where: FindOptionsWhere<Advert> = {};
    where.title = dto.title ? ILike(`%${dto.title}%`) : undefined;
    where.ownerId = dto.ownerId ?? undefined;
    where.stateId = dto.stateIds ? In(dto.stateIds) : undefined;
    where.priceHuf =
      dto.priceHufMin || dto.priceHufMax
        ? Between(dto.priceHufMin ?? 0, dto.priceHufMax ?? priceHufMax)
        : undefined;
    if (dto.locationId != null && dto.locationMaxDistance != null) {
      const location = await this.locationRepository.findOne({
        where: {
          id: dto.locationId,
        },
        select: ['latitude', 'longitude'],
      });
      const possibleLocationIds = await this._findLocationIdsInArea(
        location.latitude,
        location.longitude,
        dto.locationMaxDistance,
      );
      where.locationId = In(possibleLocationIds);
    }

    {
      let possibleModelIds: Number[] = [];

      let passedModels = await this.modelRepository.findBy({
        id: In(dto.modelIds ?? []),
      });
      for (const manufactId of dto.manufacturerIds ?? []) {
        const passedModelsForManufact = passedModels.filter(
          (x) => x.manufacturerId == manufactId,
        );
        passedModels = passedModels.filter(
          (x) => !passedModelsForManufact.includes(x),
        );
        if (passedModelsForManufact.length == 0) {
          possibleModelIds = possibleModelIds.concat(
            await this._findModelIdsOfManufacturer(manufactId),
          );
        } else {
          possibleModelIds = possibleModelIds.concat(
            passedModelsForManufact.map((x) => x.id),
          );
        }
      }
      for (const model of passedModels) {
        possibleModelIds.push(model.id);
      }

      if (possibleModelIds.length != 0) where.modelId = In(possibleModelIds);
    }

    let order: FindOptionsOrder<Advert> = {};
    if (dto.sortBy) order[dto.sortBy] = dto.sortOrder ?? 'ASC';

    const found = await this.advertRepository.find({
      where,
      order,
      skip: dto.skip,
      take: dto.count,
    });
    const resultCount = await this.advertRepository.count({ where });

    let output = new FindAdvertsResultDto();
    output.items = found as any;
    output.resultCount = resultCount;
    return output;
  }

  async addPictureToAdvert(
    advertId: number,
    dto: AddPictureToAdvertDto,
    userId: number,
  ) {
    const advertOwner: number | null = (
      await this.advertRepository.findOne({
        where: { id: advertId },
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

    const toInsert = new AdvertPic();
    toInsert.advertId = advertId;
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

  encodePicture(pic: AdvertPic): AdvertPic {
    let transformed = { ...pic } as any;
    transformed.data = pic.data.toString('base64');
    return transformed;
  }

  async findPicturesOfAdvert(id: number) {
    if (!this.advertRepository.existsBy({ id })) {
      throw new NotFoundException('No such advertisement id');
    }
    const found = await this.advertPicsRepository.findBy({ advertId: id });
    let toReturn = [];
    for (let f of found) {
      toReturn.push(this.encodePicture(f));
    }
    return toReturn;
  }

  async modifyAdvertPicture(
    advertId: number,
    dto: ModifyAdvertPictureDto,
    userId: number,
  ) {
    if (!this.advertRepository.existsBy({ id: advertId })) {
      throw new NotFoundException('No such advertisement id');
    }

    let pic = await this.advertPicsRepository.findOneBy({
      id: dto.id,
      advertId: advertId,
    });
    if (pic == null) {
      throw new NotFoundException('No such advertisement picture');
    }

    const advert = await this.advertRepository.findOneBy({ id: pic.advertId });
    if (advert == null) {
      throw new Error(
        'BUG: pic.advertId should NEVER point to a non-existent row',
      );
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

  async setPrimaryPicture(advertId: number, picId: number, userId: number) {
    if (!this.advertRepository.existsBy({ id: advertId })) {
      throw new NotFoundException('No such advertisement id');
    }

    let primaryPic = await this.advertPicsRepository.findOneBy({
      id: picId,
      advertId: advertId,
    });
    if (primaryPic == null) {
      throw new NotFoundException('No such advertisement picture');
    }

    const advert = await this.advertRepository.findOneBy({
      id: primaryPic.advertId,
    });
    if (advert == null) {
      throw new Error(
        'BUG: pic.advertId should NEVER point to a non-existent row',
      );
    }

    if (advert.ownerId != userId) {
      throw new ForbiddenException(
        'Cannot modify advertisement of another user',
      );
    }

    let images = await this.advertPicsRepository.findBy({ advertId });
    for (let img of images) {
      img.isPriority = false;
      await this.advertPicsRepository.save(img);
    }

    primaryPic.isPriority = true;
    await this.advertPicsRepository.save(primaryPic);
  }

  async getPrimaryPictureOfAdvert(id: number) {
    if (!this.advertRepository.existsBy({ id })) {
      throw new NotFoundException('No such advertisement id');
    }
    let found = await this.advertPicsRepository.findOneBy({
      advertId: id,
      isPriority: true,
    });
    if (found == null) {
      found = await this.advertPicsRepository.findOneBy({ advertId: id });
    }
    return found == null ? null : this.encodePicture(found);
  }

  async findCommentsOfAdvert(id: number, dto: PaginatedDto) {
    if (!this.advertRepository.existsBy({ id })) {
      throw new NotFoundException('No such advertisement id');
    }
    const found = await this.advertCommentsRepository.find({
      where: { advertId: id },
      skip: dto.skip,
      take: dto.count,
    });
    return found;
  }

  async addCommentToAdvert(
    advertId: number,
    dto: AddCommentToAdvertDto,
    userId: number,
  ) {
    if (!this.advertRepository.existsBy({ id: advertId })) {
      throw new NotFoundException('No such advertisement id');
    }

    const toInsert = new Comment();
    toInsert.userId = userId;
    toInsert.advertId = advertId;
    toInsert.text = dto.text;

    const result = await this.advertCommentsRepository.insert(toInsert);
    return result.identifiers[0].id;
  }

  async findRepliesToComment(advertId: number, commentId: number) {
    if (!this.advertRepository.existsBy({ id: advertId })) {
      throw new NotFoundException('No such advertisement id');
    }

    const found = await this.advertCommentsRepository.findOne({
      where: {
        advertId,
        id: commentId,
      },
      relations: { comments: true },
    });

    if (found == null) {
      throw new NotFoundException('No such comment');
    }

    return found.comments;
  }
}
