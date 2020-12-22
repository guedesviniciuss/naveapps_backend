import 'reflect-metadata';
import 'express-async-errors';

import express, { Request, Response, NextFunction } from 'express';

import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';
import './database';

import uploadConfig from './config/uploadConfig';

import AppError from './errors/AppError';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(uploadConfig.directory));
app.use(routes);

app.use(
  (err: Error, request: Request, response: Response, _: NextFunction) => {
    if (err instanceof AppError) {
      return response
        .status(err.statusCode)
        .json({ status: 'error', message: err.message });
    }

    return response
      .status(500)
      .json({ status: 'error', message: 'Internal server error' });
  },
);

app.listen(3333, () => {
  console.log('🚀 Back-end running on port 3333');
});
