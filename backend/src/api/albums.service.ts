import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
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

    async createAlbum(albumData): Promise <Album | null> {
        return this.prisma.album.create({data: albumData})
    }

    async modifyAlbumPictures(albumId: number, action: 'add'|'remove', pictures: {picture_id: number} []) {
        const pictureIds = pictures.map((picture) => picture.picture_id);

        if (action === 'add') {
            const updated = await this.prisma.picture.updateMany({
                where: {picture_id: {in: pictureIds}},
                data: {album_id: albumId}
            })
            return {message: 'Pictures added to album', count: updated.count};
        }
        if (action === 'remove') {
            const updated = await this.prisma.picture.updateMany({
                where: {picture_id: { in: pictureIds}, album_id: albumId,},
                data: {album_id: null}
            })
            return {message: 'Pictures removed from album', count: updated.count};
        }

        throw new Error('Invalid action. Use ?action=add or ?action=remove');
    }
}
