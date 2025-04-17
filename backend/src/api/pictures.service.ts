import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Picture, Prisma } from '@prisma/client';
import { appwriteGetImageUrl, appwriteGetFile } from '../../appwrite/appwrite.api';

@Injectable()
export class PicturesService {
  constructor(private prisma: PrismaService) {}

  async getPictureById(pictureId: number): Promise<Picture> {
    const picture = await this.prisma.picture.findUnique({ where: { picture_id: pictureId } });

    if (!picture) {
      throw new NotFoundException('picture not found');
    }
    const picture_url = await appwriteGetImageUrl(picture.storage_id);
    picture["url"] = picture_url;
    return picture;
  }

  async getAllAlbumPictures(albumId: number) {
    const album = await this.prisma.album.findUnique({
      where: {album_id: albumId},
    })

    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return this.prisma.picture.findMany({
      where: { album_id: albumId },
    });
  }
}
