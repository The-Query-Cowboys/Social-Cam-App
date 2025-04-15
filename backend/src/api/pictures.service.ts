import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Picture, Prisma } from '@prisma/client';

@Injectable()
export class PicturesService {
    constructor(private prisma: PrismaService) {}

    async getPictureById(pictureId): Promise<Picture|null> {
        return this.prisma.picture.findUnique({where: {picture_id: pictureId}})
    }
}
