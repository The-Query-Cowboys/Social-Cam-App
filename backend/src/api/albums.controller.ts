import { Controller, Get, Param, ParseIntPipe, Post, Body } from '@nestjs/common';
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
}
