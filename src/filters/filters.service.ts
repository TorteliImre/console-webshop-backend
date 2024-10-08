import { Injectable } from '@nestjs/common';
import { GetFiltersResultDto } from './filters.dto';
import { ILike, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from 'entities/Location';
import { Manufacturers } from 'entities/Manufacturers';
import { ProductStates } from 'entities/ProductStates';

@Injectable()
export class FiltersService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @InjectRepository(Manufacturers)
    private manufacturersRepository: Repository<Manufacturers>,
    @InjectRepository(ProductStates)
    private statesRepository: Repository<Manufacturers>,
  ) { }

  async getBasicFilters(): Promise<GetFiltersResultDto> {
    let result = new GetFiltersResultDto();
    result.manufacturers = await this.manufacturersRepository.find();
    result.states = await this.statesRepository.find();
    return result;
  }

  async findLocations(query: string): Promise<Location[]> {
    const queryInt = parseInt(query);
    return this.locationRepository.find({ where: [{ name: ILike(`${query}%`) }, { zip: (isNaN(queryInt) ? -1 : queryInt) }], take: 100, order: { name: 'ASC' } });
  }
}
