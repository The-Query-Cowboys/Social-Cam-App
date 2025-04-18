import { Controller, Get, Param, ParseIntPipe, Delete, HttpCode } from '@nestjs/common';
import { PicturesService } from './pictures.service';

@Controller('/api/pictures')
export class PicturesController {
    constructor(private readonly appService: PicturesService) {}

    @Get(':picture_id')
    getPicture(@Param('picture_id', ParseIntPipe) picture_id: number) {
        return this.appService.getPictureById(picture_id);
    }

    @Get('album/:album_id')
    async getAlbumPictures(@Param('album_id', ParseIntPipe) album_id: number) {
        const pictures = await this.appService.getAllAlbumPictures(album_id);
        return {pictures};
    }

    //Post

    @Delete(':picture_id')
    @HttpCode(204)
    deletePicture(@Param('picture_id', ParseIntPipe) picture_id: number) {
        return this.appService.deletePicture(picture_id);
    }
}