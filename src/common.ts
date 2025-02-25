import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { defaultPaginationCount, maxPaginationCount } from './limits';

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

export function TransformBoolean(paramName: string) {
  return Transform(({ obj }) => {
    const value = obj[paramName];
    return value.toLowerCase?.() === 'true' || value === '1';
  });
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

export class IdParamDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  id: number;
}

export class IdParam2Dto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  id1: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  id2: number;
}

export class PaginatedDto {
  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  skip: number = 0;

  @ApiPropertyOptional({
    default: defaultPaginationCount,
    maximum: maxPaginationCount,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(maxPaginationCount)
  count: number = defaultPaginationCount;
}
