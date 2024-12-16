import { Injectable, NotFoundException } from '@nestjs/common';
import { GetFiltersResultDto } from './filters.dto';
import { ILike, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from 'entities/Location';
import { Manufacturer } from 'entities/Manufacturer';
import { ProductState } from 'entities/ProductState';
import { Model } from 'entities/Model';
import { assert } from 'console';

@Injectable()
export class FiltersService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @InjectRepository(Manufacturer)
    private manufacturersRepository: Repository<Manufacturer>,
    @InjectRepository(Model)
    private modelsRepository: Repository<Model>,
    @InjectRepository(ProductState)
    private statesRepository: Repository<Manufacturer>,
  ) { }

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

  async findLocationById(id: number): Promise<Location> {
    const result = await this.locationRepository.findOneBy({ id });
    if (result == null) {
      throw new NotFoundException('No such location ID');
    }
    return result;
  }

  async getModelsForManufacturer(manufacturerId: number): Promise<Model[]> {
    return this.modelsRepository.find({
      where: { manufacturerId: manufacturerId },
    });
  }

  async getManufacturerOfModel(modelId: number): Promise<Manufacturer> {
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
