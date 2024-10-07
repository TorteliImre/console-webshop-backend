import { Location } from 'entities/Location';

export class GetFiltersResultDto {
  locations: Location[];
  manufacturers: string[];
  states: string[];
}
