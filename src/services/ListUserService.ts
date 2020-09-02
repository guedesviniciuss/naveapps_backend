import { getRepository } from 'typeorm';

import User from '../models/User';

class ListUserService {
  public async execute(authorizationLevel?: string): Promise<User[]> {
    const usersRepository = getRepository(User);

    if (authorizationLevel) {
      const users = await usersRepository.find({ where: { status: authorizationLevel } });
      return users;
    }

    const users = await usersRepository.find();
    return users;
  }
}

export default ListUserService;
