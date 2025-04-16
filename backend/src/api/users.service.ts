import { appwriteSave, appwriteGetImageUrl, appwriteGetFile, appwriteDeleteFile } from 'appwrite/appwrite.api'
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';


@Injectable()
export class UsersService {

    constructor(private prisma: PrismaService) { }

    async getAllUsers(): Promise<User[]> {
        return this.prisma.user.findMany();
    }

    async getUserById(userId): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { user_id: userId },
        });
        if (!user) {
            throw new NotFoundException(`User_id ${userId} was not found`);

        }
        return user;
    }

    async getUserEvents(userId: number, statusQuery?: number[]) {
        if (statusQuery) {
            return this.prisma.event.findMany({
                where: {
                    UserEvent: {
                        some: {
                            user_id: userId,
                            status_id: { in: statusQuery },
                        },
                    },
                },
            });
        } else {
            return this.prisma.event.findMany({
                where: {
                    UserEvent: {
                        some: {
                            user_id: userId,
                        },
                    },
                },
            });
        }
    }

    async createUser(userData): Promise<User | null> {
        return this.prisma.user.create({ data: userData });
    }

    async updateUserById(userId, userData): Promise<User | null> {
        return this.prisma.user.update({
            where: {
                user_id: userId
            },
            data: {
                nickname: userData.nickname,
                description: userData.description,
                auth_id: userData.auth_id,
                email: userData.email,
                storage_id: userData.storage_id
            }
        })
    }

    //saves an image into appwrite and returns image id
    async saveImage(file) {
        const newFileId = await appwriteSave(file)
        return newFileId
    }

    //returns an imageurl
    async getImageURL(image_id) {
        return appwriteGetImageUrl(image_id)
    }

    //returns a image file
    async getFile(image_id) {
        return appwriteGetFile(image_id)
    }

    //delete a image file
    async deleteFile(image_id) {
        return appwriteDeleteFile(image_id)
    }
}