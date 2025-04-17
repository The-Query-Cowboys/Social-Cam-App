import { Controller, Get, Param, ParseIntPipe, Query, Body, Post, UseInterceptors, Patch } from '@nestjs/common';
import { TokenService } from './token.service';


@Controller('/api/token')
export class TokenController {
  constructor(private readonly appService: TokenService) { }

  //get one user
  @Get(':user_id')
  getOneUser(@Param('user_id', ParseIntPipe) user_id: number) {
    return this.appService.getUserById(user_id);
  }

}