import { Router } from 'express';
import { getRepository } from 'typeorm';

import User from '../models/User';

import CreateUserService from '../services/CreateUserService';
import AuthorizeUserService from '../services/AuthorizeUserService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import { ensureMinimumLevelPermission } from '../middlewares/ensureLevelPermission';

import userLevel from '../config/permissions';

const usersRouter = Router();

usersRouter.get('/', ensureAuthenticated,
  ensureMinimumLevelPermission(userLevel.permission.ADMIN),
  async (request, response) => {
    const usersRepository = getRepository(User);

    const users = await usersRepository.find();

    return response.json(users);
  });

usersRouter.post('/', async (request, response) => {
  const {
    name, user_profile, email, password,
  } = request.body;

  const createUserService = new CreateUserService();

  const user = await createUserService.execute({
    name,
    email,
    user_profile,
    password,
  });

  delete user.password;

  return response.json(user);
});

usersRouter.post('/authorize/:id',
  ensureAuthenticated,
  ensureMinimumLevelPermission(userLevel.permission.ADMIN),
  async (request, response) => {
    const { id } = request.params;

    const authorizeUser = new AuthorizeUserService();
    const user = authorizeUser.execute(id);

    return response.json(user);
  });

export default usersRouter;
