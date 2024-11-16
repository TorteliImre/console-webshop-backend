import { Transform } from 'class-transformer';

/**
 * Parses a string or an string array to a number array.
 */
export function TransformNumberArray() {
  return Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((v) => Number(v))
      : value.split(',').map((v) => Number(v)),
  );
}
