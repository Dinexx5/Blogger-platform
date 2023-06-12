import { IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class updateBlogDto {
  @IsString()
  @IsNotEmpty()
  @Length(0, 15)
  @Transform(({ value }) => value?.trim?.())
  name: string;
  @IsString()
  @IsNotEmpty()
  @Length(0, 500)
  @Transform(({ value }) => value?.trim?.())
  description: string;
  @IsNotEmpty()
  @IsUrl()
  websiteUrl: string;
}
