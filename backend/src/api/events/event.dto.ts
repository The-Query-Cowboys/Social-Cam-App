import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsBoolean,
  IsDateString,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

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
export class UpdateEventDto {
  @IsString()
  @IsOptional()
  event_title?: string;

  @IsString()
  @IsOptional()
  event_description?: string;

  @IsInt()
  @IsOptional()
  album_id?: number;

  @IsString()
  @IsOptional()
  storage_id?: string;

  @IsString()
  @IsOptional()
  event_location?: string;

  @IsInt()
  @IsOptional()
  @Min(0, { message: 'Album delay cannot be negative' })
  album_delay?: number;

  @IsBoolean()
  @IsOptional()
  private?: boolean;

  @IsDateString()
  @IsOptional()
  event_date?: string;

  @IsDateString()
  @IsOptional()
  event_date_end?: string;
}

export class InviteUserDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
