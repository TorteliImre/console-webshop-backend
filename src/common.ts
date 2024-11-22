import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

export class HttpExceptionBody {
  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  })
  message: string | string[];

  @ApiPropertyOptional()
  error?: string;

  @ApiProperty()
  statusCode: number;
}

export class IdResponseDto {
  @ApiProperty()
  id: number;
}
