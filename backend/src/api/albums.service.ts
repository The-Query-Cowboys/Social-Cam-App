import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Album } from '@prisma/client';

@Injectable()
export class AlbumsService {

    constructor(private prisma: PrismaService) {}

    async getAlbumByEventId(eventId: number) {
        const event = await this.prisma.event.findUnique({
            where: { event_id: eventId},
            select: {album_id: true}
        });

        const album = await this.prisma.album.findUnique({
            where: {album_id: event?.album_id}
        })

        return album;
    }
}
