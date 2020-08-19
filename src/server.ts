import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import routes from './routes';
import './database';

import AppError from './errors/AppError';

const app = express();

app.use(express.json());
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({ type: 'error', message: err.message });
  }

  console.log(err);

  return response.json({ status: 'error', message: 'Internal server error' });
});

app.listen(3333, () => {
  console.log('🚀 Back-end running on port 3333');
});
