import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import uploadConfig from '../config/uploadConfig';

import Application from '../models/Application';
import User from '../models/User';

import AppError from '../errors/AppError';

interface Request {
  user_id: string,
  application_id: string;
  thumbnailFilename: string;
}

class UpdateAvatarService {
  public async execute({
    user_id,
    application_id,
    thumbnailFilename,
  }: Request): Promise<Application> {
    const applicationRepository = getRepository(Application);
    const userRepository = getRepository(User);

    const user = await userRepository.findOne(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change', 401);
    }

    // Verificar se é uuid
    const application = await applicationRepository.findOne(application_id);

    if (!application) {
      throw new AppError('Application does not exist');
    }

    if (application.thumbnail) {
      const thumbnailApplicationFilePath = path.join(uploadConfig.directory, application.thumbnail);
      const thumbnailAlreadyExists = await fs.promises.stat(thumbnailApplicationFilePath);

      if (thumbnailAlreadyExists) {
        await fs.promises.unlink(thumbnailApplicationFilePath);
      }
    }

    application.thumbnail = thumbnailFilename;

    await applicationRepository.save(application);
    return application;
  }
}

export default UpdateAvatarService;
