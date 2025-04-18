// src/redis-test/redis-test.module.ts
import { Module } from '@nestjs/common';
import { RedisTestService } from './redis-test.service';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get('REDIS_PASSWORD'),
          tls:
            configService.get<string>('REDIS_TLS') === 'true' ? {} : undefined,
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'test-queue',
    }),
  ],
  providers: [RedisTestService],
  exports: [RedisTestService],
})
export class RedisTestModule {}
