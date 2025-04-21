import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class PushTokenService {
  constructor(private prisma: PrismaService) {}
  async registerPushToken(userId: number, token: string) {
    const user = await this.prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const existingToken = await this.prisma.userPushToken.findFirst({
      where: {
        user_id: userId,
        token: token,
      },
    });

    if (existingToken) {
      return existingToken;
    }

    return this.prisma.userPushToken.create({
      data: {
        user_id: userId,
        token: token,
      },
    });
  }

  async getUserPushTokens(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Return all tokens for this user
    return this.prisma.userPushToken.findMany({
      where: {
        user_id: userId,
      },
    });
  }

  async deletePushToken(userId: number, token: string) {
    // When a user deletes app from device
    const existingToken = await this.prisma.userPushToken.findFirst({
      where: {
        user_id: userId,
        token: token,
      },
    });

    if (!existingToken) {
      throw new NotFoundException(`Push token not found for user ${userId}`);
    }

    // Delete the token
    return this.prisma.userPushToken.delete({
      where: {
        token_id: existingToken.token_id,
      },
    });
  }
}
