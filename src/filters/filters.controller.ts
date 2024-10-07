import { Controller, Get } from '@nestjs/common';
import { FiltersService } from './filters.service';
import { Location } from 'entities/Location';

@Controller('filters')
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Get('get')
  async getBasicFilters() {
    return await this.filtersService.getBasicFilters();
  }
}
