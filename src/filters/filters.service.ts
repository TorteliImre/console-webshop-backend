import { Injectable } from '@nestjs/common';
import { GetFiltersResultDto } from './filters.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from 'entities/Location';

@Injectable()
export class FiltersService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async getBasicFilters(): Promise<GetFiltersResultDto> {
    let result = new GetFiltersResultDto();
    result.locations = await this.locationRepository.find();
    return result;
  }
}
