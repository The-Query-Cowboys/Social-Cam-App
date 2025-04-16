import { Controller, Get, Param, ParseIntPipe, Post, Body, Patch, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './create-album.dto';

@Controller('/api/albums')
export class AlbumsController {
    constructor(private readonly appService: AlbumsService) {}

    @Get(':event_id')
    getAlbum(@Param('event_id', ParseIntPipe) event_id: number) {
        return this.appService.getAlbumByEventId(event_id);
    }

    @Post()
    @UsePipes(new ValidationPipe({whitelist: true}))
    createAlbum(
        @Body() albumData: CreateAlbumDto) {
            return this.appService.createAlbum(albumData);
    }

    @Patch(':album_id')
    updateAlbumPictures(
        @Param('album_id', ParseIntPipe) album_id: number,
        @Query('action') action: 'add' | 'remove',
        @Body() body: {pictures: {picture_id: number}[]}
    ) {
        return this.appService.modifyAlbumPictures(album_id, action, body.pictures);
    }
}
