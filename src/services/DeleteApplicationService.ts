import { getRepository } from 'typeorm';
import Application from '../models/Application';

import AppError from '../errors/AppError';

class DeleteApplicationService {
  public async execute(id: string): Promise<void> {
    const applicationsRepository = getRepository(Application);
    const application = await applicationsRepository.findOne(id);

    if (!application) {
      throw new AppError('Application do not exists');
    }

    await applicationsRepository.remove(application);
  }
}

export default DeleteApplicationService;
