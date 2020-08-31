import { getRepository } from 'typeorm';

import User from '../models/User';

import AppError from '../errors/AppError';

class UnauthorizeUserService {
  public async execute(id: string): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(id);

    if (!user) {
      throw new AppError('User does not exist');
    }

    user.status = false;
    await usersRepository.save(user);

    return user;
  }
}

export default UnauthorizeUserService;
