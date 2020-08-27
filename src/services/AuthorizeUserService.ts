import { getRepository } from 'typeorm';

import User from '../models/User';

import AppError from '../errors/AppError';

class AuthorizeUserService {
  public async execute(id: string): Promise<User> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne(id);

    if (!user) {
      throw new AppError('User does not exist');
    }

    user.status = true;

    await userRepository.save(user);

    return user;
  }
}

export default AuthorizeUserService;
