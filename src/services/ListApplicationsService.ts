import { getRepository, Raw } from 'typeorm';

import Application from '../models/Application';

import userLevel from '../config/permissions';

interface Request {
  id: string;
  authorizationLevel: number;
  name: string | undefined;
}

class ListApplicationsService {
  public async execute({ id, authorizationLevel, name }: Request): Promise<Application[]> {
    const applicationsRepository = getRepository(Application);

    if (name && authorizationLevel >= userLevel.permission.ADMIN) {
      const searchedApplication = await applicationsRepository.find({ name: Raw((alias) => `${alias} ILIKE '%${name}%'`) });
      return searchedApplication;
    }

    if (authorizationLevel >= userLevel.permission.ADMIN) {
      const applications = await applicationsRepository.find();
      return applications;
    }

    if (name) {
      const searchedApplication = await applicationsRepository.find({ user_id: id, name: Raw((alias) => `${alias} ILIKE '%${name}%'`) });
      return searchedApplication;
    }

    const searchedApplication = await applicationsRepository.find({ user_id: id });
    return searchedApplication;
  }
}

export default ListApplicationsService;
