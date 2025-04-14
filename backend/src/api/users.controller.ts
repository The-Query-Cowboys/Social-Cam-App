import { Controller, Get, Param, ParseIntPipe, Query, Body, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly appService: UsersService) { }

  @Get('')
  getAllUsers() {
    return this.appService.getAllUsers();
  }

  @Get(':user_id')
  getOneUser(@Param('user_id', ParseIntPipe) user_id: number) {
    return this.appService.getUserById(user_id);
  }

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

  @Post() 
  async createUser(
    @Body() userData: { username: string; nickname: string; description: string; auth_id: string; storage_id: string; email: string; }) 
    { 
      return this.appService.createUser(userData);  
    }
}