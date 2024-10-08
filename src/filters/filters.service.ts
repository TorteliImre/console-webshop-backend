import { Injectable } from '@nestjs/common';
import { GetFiltersResultDto } from './filters.dto';
import { Like, Repository } from 'typeorm';
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
  ) {}

  async getBasicFilters(): Promise<GetFiltersResultDto> {
    let result = new GetFiltersResultDto();
    result.manufacturers = await this.manufacturersRepository.find();
    result.states = await this.statesRepository.find();
    return result;
  }
}
