import { Router } from 'express';
import CreateUserService from '../services/CreateUserService';

const usersRouter = Router();

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

export default usersRouter;
