import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisTestModule } from './api/redis-test/redis-test.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from './api/users.service';
import { UsersController } from './api/users.controller';
import { AlbumsService } from './api/albums.service';
import { AlbumsController } from './api/albums.controller';
import { PicturesService } from './api/pictures.service';
import { PicturesController } from './api/pictures.controller';
import { PrismaService } from './prisma.service';
import { BullModule } from '@nestjs/bullmq';
import { EventsModule } from './api/events/events.module';
import { TokenService } from './api/token.service';
import { TokenController } from './api/token.controller';
import { NotificationsModule } from './api/notifications/notifications.module';
import { PushTokenController } from './api/user-push-tokens/push-token.controller';
import { PushTokenService } from './api/user-push-tokens/push-token.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'dev'}`,
    }),
    RedisTestModule,
    EventsModule,
  ],
  controllers: [
    AppController,
    UsersController,
    AlbumsController,
    PicturesController,
    TokenController,
    PushTokenController,
  ],
  providers: [
    AppService,
    UsersService,
    AlbumsService,
    PicturesService,
    PrismaService,
    TokenService,
    PushTokenService,
  ],
})
export class AppModule {}
