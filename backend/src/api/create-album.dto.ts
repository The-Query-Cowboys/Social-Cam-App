import {IsString, IsNotEmpty} from 'class-validator';

export class CreateAlbumDto {
    @IsString()
    @IsNotEmpty()
    album_name: string;
}