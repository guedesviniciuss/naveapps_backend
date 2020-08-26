import multer from 'multer';
import { Router } from 'express';
import { getRepository } from 'typeorm';

import userLevel from '../config/permissions';

import Application from '../models/Application';
import CreateApplicationService from '../services/CreateApplicationService';
import DeleteApplicationService from '../services/DeleteApplicationService';
import ListApplicationsService from '../services/ListApplicationsService';
import UpdateThumbnailService from '../services/UpdateThumbnailService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import { ensureMinimumLevelPermission } from '../middlewares/ensureLevelPermission';

import uploadConfig from '../config/uploadConfig';

const applicationsRouter = Router();

const uploadThumbnail = multer(uploadConfig);

applicationsRouter.get('/', async (request, response) => {
  const { name } = request.query;

  const query: string = name!;

  const listApplications = new ListApplicationsService();

  const applications = await listApplications.execute({ name: query });

  return response.status(200).json(applications);
});

applicationsRouter.get('/:name', async (request, response) => {
  const { name } = request.params;

  const applicationsRepository = getRepository(Application);

  const application = await applicationsRepository.findOne({ name });

  return response.status(200).json(application);
});

applicationsRouter.post('/', ensureAuthenticated, async (request, response) => {
  const {
    name, description, summary, link,
  } = request.body;

  const createApplication = new CreateApplicationService();

  const application = await createApplication.execute({
    user_id: request.user.id,
    name,
    summary,
    description,
    link,
  });

  return response.json(application);
});

applicationsRouter.patch('/thumbnail/:id', ensureAuthenticated, uploadThumbnail.single('file'), async (request, response) => {
  const { id } = request.params;
  const user_id = request.user.id;

  const updateThumbnail = new UpdateThumbnailService();
  const application = await updateThumbnail.execute(
    {
      user_id,
      application_id: id,
      thumbnailFilename: request.file.filename,
    },
  );

  return response.json(application);
});

applicationsRouter.delete('/:id', ensureAuthenticated, ensureMinimumLevelPermission(userLevel.permission.ADMIN), async (request, response) => {
  const { id } = request.params;

  const deleteApplication = new DeleteApplicationService();
  await deleteApplication.execute(id);
  return response.status(204).send();
});

export default applicationsRouter;
