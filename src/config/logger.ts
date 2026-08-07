import pino, { type LoggerOptions } from 'pino';
import { env } from './env.js';

const options: LoggerOptions = {
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  redact: {
    paths: ['req.body.password', 'password', '*.password', 'token', 'accessToken', 'refreshToken'],
    remove: true,
  },
  serializers: {
    err: pino.stdSerializers.err,
  },
};

if (env.NODE_ENV !== 'production') {
  options.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
      ignore: 'pid,hostname',
      singleLine: true,
    },
  };
}

export const logger = pino(options);
