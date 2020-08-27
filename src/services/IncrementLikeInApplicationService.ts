import { getRepository } from 'typeorm';

import Application from '../models/Application';

import AppError from '../errors/AppError';

class IncrementLikeInApplicationService {
  public async execute(id: string): Promise<Application> {
    const applicationRepository = getRepository(Application);

    const application = await applicationRepository.findOne(id);

    if (!application) {
      throw new AppError('Application do not exists');
    }

    application.likes += 1; // Increment like on applicaton

    await applicationRepository.save(application);
    return application;
  }
}

export default IncrementLikeInApplicationService;
