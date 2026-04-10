import 'reflect-metadata';
import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as serverless from 'serverless-http';
import { AppModule } from './app.module';
import { applyAppSettings } from './app.bootstrap';

let cachedHandler: ReturnType<typeof serverless> | undefined;

export async function createServerlessHandler(): Promise<ReturnType<typeof serverless>> {
  if (cachedHandler) {
    return cachedHandler;
  }

  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter, {
    logger: process.env.VERCEL ? ['error', 'warn'] : undefined,
  });
  applyAppSettings(app);
  await app.init();

  cachedHandler = serverless(expressApp);
  return cachedHandler;
}
