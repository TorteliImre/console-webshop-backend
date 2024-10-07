import { Controller, Get } from '@nestjs/common';
import { FiltersService } from './filters.service';
import { Location } from 'entities/Location';

export class GetFiltersResultDto {
  locations: Location[];
  manufacturers: string[];
  states: string[];
}

@Controller('filters')
export class FiltersController {
  constructor(private filtersService: FiltersService) {}

  @Get('get')
  async getBasicFilters() {
    return await this.filtersService.getBasicFilters();
  }
}
