import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { FiltersService } from './filters.service';
import { Location } from 'entities/Location';
import {
  FindLocationsDto,
  GetFiltersResultDto,
  GetManufacturerForModelDto,
  GetModelsForManufacturerDto,
  LocationDto,
  ManufacturerDto,
  ModelDto,
} from './filters.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Models } from 'entities/Models';

@Controller('filters')
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Get('getBasicFilters')
  @ApiOperation({
    summary: 'Get list of manufacturers and product states',
    tags: ['filters'],
  })
  @ApiOkResponse({ type: GetFiltersResultDto })
  async getBasicFilters() {
    return await this.filtersService.getBasicFilters();
  }

  @Get('findLocations')
  @ApiOperation({
    summary: 'Find locations by name and ZIP code',
    tags: ['filters'],
  })
  @ApiOkResponse({ type: LocationDto, isArray: true })
  async findLocations(@Query() dto: FindLocationsDto) {
    return await this.filtersService.findLocations(dto.query);
  }

  @Get('getModelsForManufacturer')
  @ApiOperation({
    summary: 'Get models produced by a manufacturer',
    tags: ['filters'],
  })
  @ApiOkResponse({ type: ModelDto, isArray: true })
  async getModelsForManufacturer(@Query() dto: GetModelsForManufacturerDto) {
    return await this.filtersService.getModelsForManufacturer(
      dto.manufacturerId,
    );
  }

  @Get('manufacturerOfModel')
  @ApiOperation({
    summary: 'Get which manufacturer produces a model',
    tags: ['filters'],
  })
  @ApiOkResponse({ type: ManufacturerDto })
  async getManufacturerOfModel(@Query() dto: GetManufacturerForModelDto) {
    return await this.filtersService.getManufacturerOfModel(dto.modelId);
  }
}
