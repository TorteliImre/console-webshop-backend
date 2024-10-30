import { Injectable, NotFoundException } from '@nestjs/common';
import { GetFiltersResultDto } from './filters.dto';
import { ILike, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from 'entities/Location';
import { Manufacturers } from 'entities/Manufacturers';
import { ProductStates } from 'entities/ProductStates';
import { Models } from 'entities/Models';
import { assert } from 'console';

@Injectable()
export class FiltersService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @InjectRepository(Manufacturers)
    private manufacturersRepository: Repository<Manufacturers>,
    @InjectRepository(Models)
    private modelsRepository: Repository<Models>,
    @InjectRepository(ProductStates)
    private statesRepository: Repository<Manufacturers>,
  ) {}

  async getBasicFilters(): Promise<GetFiltersResultDto> {
    let result = new GetFiltersResultDto();
    result.manufacturers = await this.manufacturersRepository.find();
    result.states = await this.statesRepository.find();
    return result;
  }

  async findLocations(query: string): Promise<Location[]> {
    const queryInt = parseInt(query);
    return this.locationRepository.find({
      where: [
        { name: ILike(`${query}%`) },
        { zip: isNaN(queryInt) ? -1 : queryInt },
      ],
      take: 100,
      order: { name: 'ASC' },
    });
  }

  async getModelsForManufacturer(manufacturerId: number): Promise<Models[]> {
    return this.modelsRepository.find({
      where: { manufacturerId: manufacturerId },
    });
  }

  async getManufacturerOfModel(modelId: number): Promise<Manufacturers> {
    const found = await this.modelsRepository.findOne({
      where: { id: modelId },
      relations: { manufacturer: true },
    });
    if (found == null) {
      throw new NotFoundException('No such model id');
    }
    assert(found.manufacturer);
    return found.manufacturer;
  }
}
