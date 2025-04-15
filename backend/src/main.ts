import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import multiPart from '@fastify/multipart';
import fastyfyMultipart from '@fastify/multipart';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.register(multiPart);
  app.register(fastyfyMultipart);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
