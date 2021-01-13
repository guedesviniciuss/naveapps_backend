import { getRepository } from 'typeorm';

import Application from '../models/Application';

interface ProprietaryApplicationProps {
  authorizationLevel?:number;
  userId:string;
}
class ListProprietaryApplicationSerive {
  public async execute({
    // authorizationLevel,
    userId,
  }:ProprietaryApplicationProps): Promise<Application[]> {
    const applicationsRepository = getRepository(Application);

    const applications = await applicationsRepository.find({ where: { user_id: userId } });
    return applications;
  }
}

export default ListProprietaryApplicationSerive;
