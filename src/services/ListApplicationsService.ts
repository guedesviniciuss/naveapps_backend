import { getRepository, Raw } from 'typeorm';

import Application from '../models/Application';

interface Request {
  name: string | undefined;
}

class ListApplicationsService {
  public async execute({ name }: Request): Promise<Application[]> {
    const applicationsRepository = getRepository(Application);

    if (name) {
      const searchedApplication = await applicationsRepository.find({ name: Raw((alias) => `${alias} ILIKE '%${name}%'`) });
      return searchedApplication;
    }

    const applications = await applicationsRepository.find();
    return applications;
  }
}

export default ListApplicationsService;
