import { Router } from 'express';

import CreateUserService from '../services/CreateUserService';
import ListUserService from '../services/ListUserService';
import AuthorizeUserService from '../services/AuthorizeUserService';
import UnauthorizeUserService from '../services/UnauthorizeUserService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import { ensureMinimumLevelPermission } from '../middlewares/ensureLevelPermission';

import userLevel from '../config/permissions';

const usersRouter = Router();

usersRouter.get('/', ensureAuthenticated,
  ensureMinimumLevelPermission(userLevel.permission.ADMIN),
  async (request, response) => {
    const { status } = request.query;

    const listUser = new ListUserService();

    const users = await listUser.execute(status);

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

usersRouter.post('/unauthorize/:id',
  ensureAuthenticated,
  ensureMinimumLevelPermission(userLevel.permission.ADMIN),
  async (request, response) => {
    const { id } = request.params;

    const unauthorizeUser = new UnauthorizeUserService();
    const user = unauthorizeUser.execute(id);

    return response.json(user);
  });

export default usersRouter;
