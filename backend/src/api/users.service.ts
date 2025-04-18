import {
  appwriteSave,
  appwriteGetImageUrl,
  appwriteGetFile,
  appwriteDeleteFile,
} from '../../appwrite/appwrite.api';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService) {}

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
    const userExists = await this.prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!userExists) {
      throw new NotFoundException(`User_id ${userId} was not found`);
    }
    try {
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
    } catch (error) {
      throw new Error(
        'Failed to get events associated with the user: ',
        error.message,
      );
    }
  }

  async createUser(createUserDto): Promise<User | null> {
    const usernameTaken = await this.prisma.user.findFirst({
      where: { username: createUserDto.username },
    });

    if (usernameTaken) {
      throw new BadRequestException('A User with that username already exists');
    }

    const emailTaken = await this.prisma.user.findFirst({
      where: { email: createUserDto.email },
    });

    if (emailTaken) {
      throw new BadRequestException('A User with that email already exists');
    }

    try {
      const userData = {
        username: createUserDto.username,
        email: createUserDto.email,
        auth_id: createUserDto.auth_id,
        storage_id: '67fff5f70029bb516bcc',
        description: '',
        nickname: createUserDto.username,
      };
      return this.prisma.user.create({ data: userData });
    } catch {
      throw new Error(`Failed to create new user`);
    }
  }

  async updateUserById(userId, userData): Promise<User | null> {
    return this.prisma.user.update({
      where: {
        user_id: userId,
      },
      data: {
        nickname: userData.nickname,
        description: userData.description,
        auth_id: userData.auth_id,
        email: userData.email,
        storage_id: userData.storage_id,
      },
    });
  }

  //saves an image into appwrite and returns image id
  async saveImage(file) {
    const newFileId = await appwriteSave(file);
    return newFileId;
  }

  //returns an imageurl
  async getImageURL(image_id) {
    return appwriteGetImageUrl(image_id);
  }

  //returns a image file
  async getFile(image_id) {
    return appwriteGetFile(image_id);
  }

  //delete a image file
  async deleteFile(image_id) {
    return appwriteDeleteFile(image_id);
  }
}
