// src/redis-test/redis-test.controller.ts
import { Controller, Get } from '@nestjs/common';
import { RedisTestService } from './redis-test.service';

@Controller('redis-test')
export class RedisTestController {
  constructor(private readonly redisTestService: RedisTestService) {}

  @Get()
  async testConnection() {
    const isConnected = await this.redisTestService.testRedisConnection();
    return {
      status: isConnected ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
    };
  }
}
