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
  video: string;
  gallery: Array<string>;
}

class CreateApplicationService {
  public async execute({
    user_id, name, summary, description, link, thumbnail, gallery, video,
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

    if (gallery.length < 3) {
      throw new AppError('Gallery must have 3 photos');
    }

    const application = applicationsRepository.create({
      user_id,
      name,
      summary,
      description,
      link,
      thumbnail: thumbnailApplicationFilePath,
      gallery,
      video,
    });

    await applicationsRepository.save(application);

    return application;
  }
}

export default CreateApplicationService;
