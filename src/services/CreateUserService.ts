import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';

import AppError from '../errors/AppError';

interface Request {
  name: string;
  user_profile: number;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({
    name, user_profile, email, password,
  }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const emailAlreadyExists = await usersRepository.findOne({
      where: { email },
    });

    if (emailAlreadyExists) {
      throw new AppError('Email address already used');
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      user_profile,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
