import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Picture, Prisma } from '@prisma/client';
import { appwriteGetImageUrl, appwriteGetFile, appwriteDeleteFile } from '../../appwrite/appwrite.api';

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

  async createPicture(storage_id: string, album_id?: number) {
    const newPicture = await this.prisma.picture.create({
      data: {storage_id, 
        album_id: album_id ?? null,
        type_id: 1
      }
    })
    return newPicture;
  }

  async deletePicture(pictureId: number): Promise<void> {
    const picture = await this.prisma.picture.findUnique({where: {picture_id: pictureId}});

    if (!picture) {
      throw new NotFoundException(`Picture with ID ${pictureId} not found`);
    }

    try {
      await appwriteDeleteFile(picture.storage_id);
    } catch (error) {
      console.log(`Appwrite file delete failed for storage_id ${picture.storage_id}:`, error.message);
    }

    await this.prisma.picture.delete({where: {picture_id: pictureId}});
  }
}
