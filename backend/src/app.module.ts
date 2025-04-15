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

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'dev'}`,
    }),
  ],
  controllers: [AppController, UsersController, AlbumsController, PicturesController],
  providers: [AppService, UsersService, AlbumsService, PicturesService, PrismaService],
})
export class AppModule {}
