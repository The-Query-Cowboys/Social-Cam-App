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

    if (exisitngToken) {
      return exisitngToken;
    }
  }
}
