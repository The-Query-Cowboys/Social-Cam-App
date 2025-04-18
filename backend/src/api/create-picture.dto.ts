import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreatePictureDto {
  @IsString()
  storage_id: string;

  @IsOptional()
  @IsInt()
  album_id?: number;
}