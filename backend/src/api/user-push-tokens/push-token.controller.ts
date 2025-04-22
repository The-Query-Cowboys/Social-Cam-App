import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';

import { PushTokenService } from './push-token.service';

@Controller(`/api/users/:userId/push-tokens`)
export class PushTokenController {
  constructor(private readonly pushTokenService: PushTokenService) {}

  @Get()
  getUserPushTokens(@Param('userId', ParseIntPipe) userId: number) {
    return this.pushTokenService.getUserPushTokens(userId);
  }

  @Post()
  registerPushToken(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: { token: string },
  ) {
    return this.pushTokenService.registerPushToken(userId, body.token);
  }

  @Delete()
  deletePushToken(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: { token: string },
  ) {
    return this.pushTokenService.deletePushToken(userId, body.token);
  }
}
