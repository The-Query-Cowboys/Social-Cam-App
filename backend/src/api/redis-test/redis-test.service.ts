// src/redis-test/redis-test.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class RedisTestService implements OnModuleInit {
  private readonly logger = new Logger(RedisTestService.name);

  constructor(@InjectQueue('test-queue') private testQueue: Queue) {}

  async onModuleInit() {
    // Use timeout to prevent app from hanging indefinitely
    const timeoutPromise = new Promise<boolean>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Redis connection test timed out after 10 seconds'));
      }, 10000);
    });

    try {
      // Race between connection test and timeout
      await Promise.race([this.testRedisConnection(), timeoutPromise]);
    } catch (error) {
      this.logger.error(`Redis connection failed: ${error.message}`);
      this.logger.warn(
        'Application will continue starting despite Redis connection failure',
      );
      // Allow app to continue starting even if Redis test fails
    }
  }

  async testRedisConnection(): Promise<boolean> {
    try {
      this.logger.log('Testing Redis connection...');
      this.logger.log(
        `Redis config: Host=${process.env.REDIS_HOST}, Port=${process.env.REDIS_PORT}, TLS=${process.env.REDIS_TLS}`,
      );

      // Try adding a job to the queue (this will fail fast if connection is bad)
      this.logger.log('Attempting to add a job to the queue...');
      const job = await this.testQueue.add(
        'connection-test',
        { timestamp: new Date().toISOString() },
        {
          removeOnComplete: true,
          attempts: 1,
        },
      );

      this.logger.log(`Successfully added job to queue with ID: ${job.id}`);
      this.logger.log('✅ Redis connection test successful!');
      return true;
    } catch (error) {
      this.logger.error(`❌ Redis connection test failed: ${error.message}`);

      // Try to provide specific error guidance
      if (error.message.includes('ECONNREFUSED')) {
        this.logger.error(
          'Connection refused - verify Redis host and port are correct',
        );
      } else if (error.message.includes('ETIMEDOUT')) {
        this.logger.error(
          'Connection timed out - check network connectivity and firewall settings',
        );
      } else if (error.message.includes('ENOTFOUND')) {
        this.logger.error('Host not found - check Redis hostname is correct');
      } else if (
        error.message.includes('WRONGPASS') ||
        error.message.includes('NOAUTH')
      ) {
        this.logger.error('Authentication failed - check Redis password');
      }

      return false;
    }
  }
}
