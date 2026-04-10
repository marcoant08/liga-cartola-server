import 'reflect-metadata';
import * as express from 'express';
import { Express } from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { applyAppSettings } from './app.bootstrap';

let cachedApp: Express | null = null;
let initPromise: Promise<Express> | null = null;

async function createApp(): Promise<Express> {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);

  const app = await NestFactory.create(AppModule, adapter, {
    logger: ['log', 'error', 'warn'],
    abortOnError: false,
  });

  applyAppSettings(app);
  await app.init();
  return expressApp;
}

export default async function handler(req: any, res: any) {
  if (!cachedApp) {
    if (!initPromise) {
      initPromise = createApp()
        .then((app) => {
          cachedApp = app;
          return app;
        })
        .catch((err) => {
          initPromise = null;
          throw err;
        });
    }
    await initPromise;
  }
  cachedApp!(req, res);
}
