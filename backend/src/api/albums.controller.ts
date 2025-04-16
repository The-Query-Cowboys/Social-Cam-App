import { Controller, Get, Param, ParseIntPipe, Post, Body, Patch, Query } from '@nestjs/common';
import { AlbumsService } from './albums.service';

@Controller('/api/albums')
export class AlbumsController {
    constructor(private readonly appService: AlbumsService) {}

    @Get(':event_id')
    getAlbum(@Param('event_id', ParseIntPipe) event_id: number) {
        return this.appService.getAlbumByEventId(event_id);
    }

    @Post()
    createAlbum(
        @Body() albumData: {album_name: string}) {
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
