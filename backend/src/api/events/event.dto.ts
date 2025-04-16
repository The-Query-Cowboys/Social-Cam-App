import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsBoolean,
  IsDateString,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateEventDto {
  @IsInt()
  @IsNotEmpty()
  event_owner_id: number;

  @IsString()
  @IsNotEmpty()
  event_title: string;

  @IsString()
  @IsNotEmpty()
  event_description: string;

  @IsInt()
  @IsNotEmpty()
  album_id: number;

  @IsString()
  @IsNotEmpty()
  storage_id: string;

  @IsString()
  @IsNotEmpty()
  event_location: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  album_delay?: number;

  @IsBoolean()
  @IsNotEmpty()
  private: boolean;

  @IsDateString()
  @IsOptional()
  event_date?: string;

  @IsDateString()
  @IsOptional()
  event_date_end?: string;
}
