import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Album } from '@prisma/client';

@Injectable()
export class AlbumsService {
  constructor(private prisma: PrismaService) {}

  async getAlbumByEventId(eventId: number) {
    const event = await this.prisma.event.findUnique({
      where: { event_id: eventId },
      select: { album_id: true },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    if (!event.album_id) {
      throw new NotFoundException(`Event with ID ${eventId} does not have an associated album`);
    }

    const album = await this.prisma.album.findUnique({
      where: { album_id: event?.album_id },
    });

    if (!album) {
      throw new NotFoundException(`Album with ID ${event.album_id} not found`)
    }

    return album;
  }

  async createAlbum(albumData): Promise<Album | null> {
    return this.prisma.album.create({ data: albumData });
  }

  async modifyAlbumPictures(
    albumId: number,
    action: 'add' | 'remove',
    pictures: { picture_id: number }[],
  ) {
    const pictureIds = pictures.map((picture) => picture.picture_id);

    if (action === 'add') {
      const updated = await this.prisma.picture.updateMany({
        where: { picture_id: { in: pictureIds } },
        data: { album_id: albumId },
      });
      return { message: 'Pictures added to album', count: updated.count };
    }
    if (action === 'remove') {
      const updated = await this.prisma.picture.updateMany({
        where: { picture_id: { in: pictureIds }, album_id: albumId },
        data: { album_id: null },
      });
      return { message: 'Pictures removed from album', count: updated.count };
    }

    throw new Error('Invalid action. Use ?action=add or ?action=remove');
  }

  async deleteAlbum(albumId: number): Promise<void> {
    const album = await this.prisma.album.findUnique({where: {album_id: albumId}})

    if (!album) {
      throw new NotFoundException(`Album with ID ${albumId} not found`);
    }

    await this.prisma.$transaction([
      this.prisma.picture.updateMany({
        where: {album_id: albumId},
        data: {album_id: null},
      }),
      this.prisma.album.delete({where: {album_id: albumId}})
    ])
  }
}