import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { env } from './config/env.js';
import { pinoHttp, type ReqId } from 'pino-http';
import { logger } from './config/logger.js';
import pino from 'pino';
import type { ServerResponse } from 'http';

const app = express();

app.set('trust proxy', 1);

app.use(
  pinoHttp({
    logger,

    customLogLevel: (_req, res, err) => {
      if (res.statusCode >= 500 || err) {
        return 'error';
      }
      if (res.statusCode >= 400) {
        return 'warn';
      }
      return 'info';
    },

    serializers: {
      err: pino.stdSerializers.err,
      req: (req: { id: ReqId; method?: string; url?: string }) => ({
        id: req.id,
        method: req.method,
        url: req.url,
      }),
      res: (res: ServerResponse) => ({
        statusCode: res.statusCode,
      }),
    },
  }),
);

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
  });
});

export { app };
