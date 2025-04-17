import {Type} from 'class-transformer';
import { IsArray, ValidateNested, IsInt } from 'class-validator';

class PictureDto {
    @IsInt()
    picture_id: number;
}

export class modifyAlbumPicturesDto {
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => PictureDto)
    pictures: PictureDto[];
}