import { getRepository } from 'typeorm';
import Application from '../models/Application';

import AppError from '../errors/AppError';

interface Request {
  user_id: string,
  name: string;
  description: string;
  link: string
}

class CreateApplicationService {
  public async execute({
    user_id, name, description, link,
  }: Request): Promise<Application> {
    const applicationsRepository = getRepository(Application);
    const findApplicationWithSameName = await applicationsRepository.findOne({ where: { name } });

    if (findApplicationWithSameName) {
      throw new AppError('App alredy exists');
    }

    const application = applicationsRepository.create({
      user_id,
      name,
      description,
      link,
    });

    await applicationsRepository.save(application);

    return application;
  }
}

export default CreateApplicationService;
