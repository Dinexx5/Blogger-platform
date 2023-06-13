import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  @Length(0, 30)
  @Transform(({ value }) => value?.trim?.())
  title: string;
  @IsString()
  @IsNotEmpty()
  @Length(0, 100)
  @Transform(({ value }) => value?.trim?.())
  shortDescription: string;
  @IsString()
  @IsNotEmpty()
  @Length(0, 1000)
  @Transform(({ value }) => value?.trim?.())
  content: string;
}
