import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

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
