import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'dev'}`,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get('REDIS_PASSWORD'),
          enableReadyCheck: true,
          retryStrategy: (times) => {
            // Exponential backoff with maximum of 10s delay
            return Math.min(Math.pow(2, times) * 1000, 10000);
          },
          connectTimeout: 10000,
          tls:
            configService.get<string>('REDIS_TLS') === 'true' ? {} : undefined,
          // Reconnect on error
          reconnectOnError: (err) => {
            const targetError =
              err.message.includes('ECONNRESET') ||
              err.message.includes('ETIMEDOUT');
            return targetError ? true : false;
          },
        },
        defaultJobOptions: {
          attempts: 5,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
          removeOnComplete: true,
          removeOnFail: 1000,
        },
      }),
      inject: [ConfigService],
    }),
    NotificationsModule,
    EventsModule,
  ],
  controllers: [
    AppController,
    UsersController,
    AlbumsController,
    PicturesController,
    TokenController,
  ],
  providers: [
    AppService,
    UsersService,
    AlbumsService,
    PicturesService,
    PrismaService,
    TokenService,
  ],
})
export class AppModule {}
