import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Picture, Prisma } from '@prisma/client';

@Injectable()
export class PicturesService {
  constructor(private prisma: PrismaService) {}

  async getPictureById(pictureId: number): Promise<Picture> {
    const picture = await this.prisma.picture.findUnique({ where: { picture_id: pictureId } });

    if (!picture) {
      throw new NotFoundException('picture not found');
    }

    return picture;
  }

  async getAllAlbumPictures(albumId: number) {
    return this.prisma.picture.findMany({
      where: { album_id: albumId },
    });
  }
}
