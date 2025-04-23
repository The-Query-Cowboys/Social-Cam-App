import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Body,
  Post,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  FileInterceptor,
  UploadedFile,
  MemoryStorageFile,
} from '@blazity/nest-file-fastify';
import { CreateUserDto } from './user.dto';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly appService: UsersService) {}

  //get all users
  @Get('')
  getAllUsers() {
    return this.appService.getAllUsers();
  }

  //get one user
  @Get(':user_id')
  getOneUser(@Param('user_id', ParseIntPipe) user_id: number) {
    return this.appService.getUserById(user_id);
  }

  @Get('/clerk/:authId')
  getUserByAuthId(@Param('authId') authId: string) {
    return this.appService.getUserByAuthId(authId);
  }

  @Get('/username/:username')
  getUserByUsername(@Param('username') username: string) {
    return this.appService.getUserByUsername(username);
  }

  //get all events for that user id
  @Get(':user_id/events')
  getUserEvents(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Query('status') status,
  ) {
    if (status) {
      const statusQuery = status.split(',').map((x) => {
        return Number(x);
      });
      return this.appService.getUserEvents(user_id, statusQuery);
    } else {
      return this.appService.getUserEvents(user_id);
    }
  }

  @Get(':userId/events/:eventId/status')
  getUserEventStatus(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('eventId', ParseIntPipe) eventId: number,
  ) {
    return this.appService.getUserEventStatus(userId, eventId);
  }

  //save a new user
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.appService.createUser(createUserDto);
  }

  //patch a user.  Things that can change are nickname, description, auth_id, email and profile picture
  //deletes old profile picture and assign new one
  @Patch('/:user_id')
  @UseInterceptors(FileInterceptor('file'))
  async patchUser(
    @Param('user_id', ParseIntPipe) user_id: number,
    @UploadedFile() file: MemoryStorageFile, //undefined if no picture is passed
    @Body()
    userData: {
      username: string;
      nickname: string;
      description: string;
      auth_id: string;
      email: string;
    }, //this is new user data
  ) {
    //if there is a new profile picture, we need to replace it
    const currentUser = await this.appService.getUserById(user_id);

    if (file !== undefined) {
      console.log('start deleting previous pic');
      userData['storage_id'] = await this.appService.saveImage(file);
      try {
        await this.appService.deleteFile(currentUser?.storage_id);
      } catch {}
    } else {
      userData['storage_id'] = currentUser?.storage_id;
    }

    //update user
    return this.appService.updateUserById(user_id, userData);
  }
}
