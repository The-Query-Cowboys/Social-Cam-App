import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AlbumsService } from './albums.service';

@Controller('/api/albums')
export class AlbumsController {
    constructor(private readonly appService: AlbumsService) {}

    @Get(':event_id')
    getAlbum(@Param('event_id', ParseIntPipe) event_id: number) {
        return this.appService.getAlbumByEventId(event_id);
    }
}
