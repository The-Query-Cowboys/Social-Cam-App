import { Controller, Get, Param, ParseIntPipe, Query, Body, Post, UseInterceptors, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor, UploadedFile, MemoryStorageFile } from '@blazity/nest-file-fastify';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly appService: UsersService) { }

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

  //get all events for that user id
  @Get(':user_id/events')
  getUserEvents(@Param('user_id', ParseIntPipe) user_id: number, @Query('status') status) {
    if (status) {
      const statusQuery = status.split(",").map((x) => { return Number(x) })
      return this.appService.getUserEvents(user_id, statusQuery);
    }
    else {
      return this.appService.getUserEvents(user_id);
    }
  }

  //save a new user
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createUser(
    @UploadedFile() file: MemoryStorageFile,
    @Body() userData: { username: string; nickname: string; description: string; auth_id: string; email: string; }
  ) {
    let profileImage = process.env.DEFAULT_PROFILE_IMAGE
    if (file !== undefined) {
      profileImage = await this.appService.saveImage(file)
    }

    console.log(profileImage, "<<< new storage_id")

    userData["storage_id"] = profileImage

    return this.appService.createUser(userData)

  }

  //patch a user.  Things that can change are nickname, description, auth_id, email and profile picture
  //deletes old profile picture and assign new one
  @Patch('/:user_id')
  @UseInterceptors(FileInterceptor('file'))
  async patchUser(
    @Param('user_id', ParseIntPipe) user_id: number,
    @UploadedFile() file: MemoryStorageFile,        //undefined if no picture is passed
    @Body() userData: { username: string; nickname: string; description: string; auth_id: string; email: string; }    //this is new user data 
  ) {
    //if there is a new profile picture, we need to replace it
    const currentUser = await this.appService.getUserById(user_id)

    if (file !== undefined) {
      console.log("start deleting previous pic")
      userData["storage_id"] = await this.appService.saveImage(file)
      try {
        await this.appService.deleteFile(currentUser?.storage_id)
      }
      catch {
      }
    }
    else {
      userData["storage_id"] = currentUser?.storage_id
    }

    //update user
    return this.appService.updateUserById(user_id, userData)
  }
}