import { Injectable, NotFoundException } from '@nestjs/common';
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
}
