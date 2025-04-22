// test/app-test.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from '../src/api/users.service';
import { UsersController } from '../src/api/users.controller';
import { AlbumsService } from '../src/api/albums.service';
import { AlbumsController } from '../src/api/albums.controller';
import { PicturesService } from '../src/api/pictures.service';
import { PicturesController } from '../src/api/pictures.controller';
import { PrismaService } from '../src/prisma.service';
import { EventsModule } from '../src/api/events/events.module';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { createBullMockProviders } from './utils/bull-mocks';
import { TokenService } from '../src/api/token.service';
import { TokenController } from '../src/api/token.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'dev'}`,
    }),
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
    ...createBullMockProviders(),
  ],
})
export class AppModule {}
