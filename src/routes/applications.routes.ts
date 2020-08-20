import multer from 'multer';
import { Router } from 'express';
import { getRepository } from 'typeorm';

import Application from '../models/Application';
import CreateApplicationService from '../services/CreateApplicationService';
import UpdateThumbnailService from '../services/UpdateThumbnailService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import uploadConfig from '../config/uploadConfig';

const applicationsRouter = Router();

const uploadThumbnail = multer(uploadConfig);

applicationsRouter.get('/', async (request, response) => {
  const applicationsRepository = getRepository(Application);
  const applications = await applicationsRepository.find();

  return response.status(200).json(applications);
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

export default applicationsRouter;
