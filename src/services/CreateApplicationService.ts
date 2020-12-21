import { getRepository } from 'typeorm';
import path from 'path';
import Application from '../models/Application';

import uploadConfig from '../config/uploadConfig';
import AppError from '../errors/AppError';

interface Request {
  user_id: string,
  name: string;
  summary: string;
  description: string;
  link: string;
  thumbnail: string;
}

class CreateApplicationService {
  public async execute({
    user_id, name, summary, description, link, thumbnail,
  }: Request): Promise<Application> {
    const applicationsRepository = getRepository(Application);
    const findApplicationWithSameName = await applicationsRepository.findOne({ where: { name } });

    if (findApplicationWithSameName) {
      throw new AppError('App alredy exists');
    }

    if (!thumbnail) {
      throw new AppError('Thumbnail does not exist');
    }

    const thumbnailApplicationFilePath = path.join(uploadConfig.directory, thumbnail);

    const application = applicationsRepository.create({
      user_id,
      name,
      summary,
      description,
      link,
      thumbnail: thumbnailApplicationFilePath,
    });

    await applicationsRepository.save(application);

    return application;
  }
}

export default CreateApplicationService;
