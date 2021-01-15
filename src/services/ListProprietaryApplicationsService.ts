import { getRepository } from 'typeorm';

import Application from '../models/Application';

import userLevel from '../config/permissions';

interface ProprietaryApplicationProps {
  userId:string;
  authorizationLevel: number;
}

class ListProprietaryApplicationsService {
  public async execute({
    userId,
    authorizationLevel,
  }:ProprietaryApplicationProps): Promise<Application[]> {
    const applicationsRepository = getRepository(Application);

    if (authorizationLevel === userLevel.permission.NORMAL_USER) {
      const applications = await applicationsRepository
        .createQueryBuilder('app')
        .leftJoinAndSelect('app.user', 'user')
        .where('app.user_id = :user', { user: userId }).select(['app'])
        .getMany();

      return applications;
    }

    const applications = await applicationsRepository
      .createQueryBuilder('app')
      .leftJoinAndSelect('app.user', 'user')
      .where('user.profile <= :profile', { profile: authorizationLevel }).select(['app'])
      .getMany();

    return applications;
  }
}

export default ListProprietaryApplicationsService;
