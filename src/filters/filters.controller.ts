import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { FiltersService } from './filters.service';
import { Location } from 'entities/Location';
import {
  FindLocationsDto,
  GetFiltersResultDto,
  GetModelsForManufacturerDto,
  LocationDto,
  ModelDto,
} from './filters.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Models } from 'entities/Models';

@Controller('filters')
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Get('getBasicFilters')
  @ApiOperation({ tags: ['filters'] })
  @ApiOkResponse({ type: GetFiltersResultDto })
  async getBasicFilters() {
    return await this.filtersService.getBasicFilters();
  }

  @Get('findLocations')
  @ApiOperation({ tags: ['filters'] })
  @ApiOkResponse({ type: LocationDto, isArray: true })
  async findLocations(@Query() dto: FindLocationsDto) {
    return await this.filtersService.findLocations(dto.query);
  }

  @Get('getModelsForManufacturer')
  @ApiOperation({ tags: ['filters'] })
  @ApiOkResponse({ type: ModelDto, isArray: true })
  async getModelsForManufacturer(@Query() dto: GetModelsForManufacturerDto) {
    return await this.filtersService.getModelsForManufacturer(
      dto.manufacturerId,
    );
  }
}
