import { Controller, Get, Param, Query } from '@nestjs/common';
import { FiltersService } from './filters.service';
import {
  FindLocationsDto,
  GetFiltersResultDto,
  GetManufacturerForModelDto,
  GetModelsForManufacturerDto,
  GetLocationsResponseDto,
  GetManufacturersResultDto,
  GetModelResultDto,
} from './filters.dto';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { HttpExceptionBody } from 'src/common';

@Controller('filters')
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Get('basic')
  @ApiOperation({
    summary: 'Get list of manufacturers and product states',
    tags: ['filters'],
  })
  @ApiOkResponse({ type: GetFiltersResultDto })
  async getBasicFilters() {
    return await this.filtersService.getBasicFilters();
  }

  @Get('locations')
  @ApiOperation({
    summary: 'Find locations by name and ZIP code',
    tags: ['filters'],
  })
  @ApiOkResponse({ type: GetLocationsResponseDto, isArray: true })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  async findLocations(@Query() dto: FindLocationsDto) {
    return await this.filtersService.findLocations(dto.query);
  }

  @Get('modelsForManufacturer')
  @ApiOperation({
    summary: 'Get models produced by a manufacturer',
    tags: ['filters'],
  })
  @ApiOkResponse({ type: GetModelResultDto, isArray: true })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
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
  @ApiOkResponse({ type: GetManufacturersResultDto })
  @ApiBadRequestResponse({ type: HttpExceptionBody })
  async getManufacturerOfModel(@Query() dto: GetManufacturerForModelDto) {
    return await this.filtersService.getManufacturerOfModel(dto.modelId);
  }
}
