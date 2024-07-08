import { IsNotEmpty, IsString } from 'class-validator';

export class TagsDto {
  @IsNotEmpty()
  @IsString()
  value: string;

  @IsNotEmpty()
  @IsString()
  label: string;
}
