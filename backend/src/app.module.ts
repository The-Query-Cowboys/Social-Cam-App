import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './api/users.service';
import { UsersController } from './api/users.controller';
import { AlbumsService } from './api/albums.service';
import { AlbumsController } from './api/albums.controller';
import { PicturesService } from './api/pictures.service';
import { PicturesController } from './api/pictures.controller';
import { PrismaService } from './prisma.service';
import { BullModule } from '@nestjs/bullmq';
import { EventsModule } from './api/events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'dev'}`,
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: 6379,
        password: process.env.REDIS_PASSWORD,
        enableReadyCheck: true,
        retryStrategy: (times) => {
          // Exponential backoff with maximum of 10s delay
          return Math.min(Math.pow(2, times) * 1000, 10000);
        },
        connectTimeout: 10000,
        // Add TLS if needed (remove if not using TLS)
        tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
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
    EventsModule,
  ],
  controllers: [
    AppController,
    UsersController,
    AlbumsController,
    PicturesController,
  ],
  providers: [
    AppService,
    UsersService,
    AlbumsService,
    PicturesService,
    PrismaService,
  ],
})
export class AppModule {}
