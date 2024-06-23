import { Transform } from 'class-transformer';
import { IsOptional, IsString, Max, Validate } from 'class-validator';
import { IsValidIntConstraint } from '../utils/isValidNumberConstraint';
import { MAX_PER_PAGE } from '../utils/page-helpers';

export class QueryDto {
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'number' ? value : parseFloat(value),
  )
  @Validate(IsValidIntConstraint)
  @Max(MAX_PER_PAGE)
  limit: number | undefined;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'number' ? value : parseFloat(value),
  )
  @Validate(IsValidIntConstraint)
  page: number | undefined;

  @IsOptional()
  @IsString()
  keyword: string | undefined;
}
