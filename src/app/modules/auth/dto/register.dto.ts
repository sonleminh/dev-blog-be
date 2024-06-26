import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsLowercase,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class RegisterDTO {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(5, 26)
  @IsLowercase()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(5)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(4)
  name: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  role: string;
}
