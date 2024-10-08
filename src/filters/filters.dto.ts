import { Manufacturers } from 'entities/Manufacturers';
import { ProductStates } from 'entities/ProductStates';

export class GetFiltersResultDto {
  manufacturers: Manufacturers[];
  states: ProductStates[];
}
