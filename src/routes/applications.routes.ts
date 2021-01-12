import multer from 'multer';
import { Router } from 'express';
import { getRepository } from 'typeorm';

import userLevel from '../config/permissions';

import Application from '../models/Application';
import CreateApplicationService from '../services/CreateApplicationService';
import DeleteApplicationService from '../services/DeleteApplicationService';
import ListApplicationsService from '../services/ListApplicationsService';
import UpdateThumbnailService from '../services/UpdateThumbnailService';
import IncrementLikeInApplicationService from '../services/IncrementLikeInApplicationService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import { ensureMinimumLevelPermission } from '../middlewares/ensureLevelPermission';

import uploadConfig from '../config/uploadConfig';

const applicationsRouter = Router();

const uploadImage = multer(uploadConfig);

interface Index {
  filename:string;
}

applicationsRouter.get('/', async (request, response) => {
  const { name } = request.query;

  const query: string = name as string;

  const listApplications = new ListApplicationsService();

  const applications = await listApplications.execute({
    name: query,
  });

  return response.status(200).json(applications);
});

applicationsRouter.get('/:name', async (request, response) => {
  const { name } = request.params;

  const applicationsRepository = getRepository(Application);

  const application = await applicationsRepository.findOne({ name });

  return response.status(200).json(application);
});

applicationsRouter.post('/', ensureAuthenticated, uploadImage.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'gallery', maxCount: 3 }]), async (request, response) => {
  const {
    name, description, summary, link, video,
  } = request.body;

  const createApplication = new CreateApplicationService();
  // eslint-disable-next-line prefer-const
  let gallery:Array<string> = [];
  request.files.gallery.forEach((i:Index) => gallery.push(i.filename));

  const application = await createApplication.execute({
    user_id: request.user.id,
    name,
    summary,
    description,
    link,
    thumbnail: request.files?.thumbnail[0]?.filename,
    gallery,
    video,
  });

  return response.json(application);
});

applicationsRouter.post('/likes/:id', async (request, response) => {
  const { id } = request.params;

  const incrementLikeInApplication = new IncrementLikeInApplicationService();

  const application = await incrementLikeInApplication.execute(id);
  return response.json(application);
});

applicationsRouter.patch('/thumbnail/:id', ensureAuthenticated, uploadImage.single('thumbnail'), async (request, response) => {
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

applicationsRouter.delete('/:id',
  ensureAuthenticated,
  ensureMinimumLevelPermission(userLevel.permission.ADMIN), async (request, response) => {
    const { id } = request.params;

    const deleteApplication = new DeleteApplicationService();
    await deleteApplication.execute(id);
    return response.status(204).send();
  });

export default applicationsRouter;

// [ X ] RECEBER IMAGENS PARA A GALERIA
// [ X ] SALVAR NO BANCO
// [  ] SERVIR PARA O FRONT OS LINKS DAS IMAGENS ESTATICAS
