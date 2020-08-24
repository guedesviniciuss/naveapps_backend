import { createConnection, getConnection } from 'typeorm';

import Profiles from '../models/Profile';

createConnection().then(() => getConnection()
  .createQueryBuilder()
  .insert()
  .into(Profiles)
  .onConflict('("id") DO NOTHING')
  .values([
    { id: 1, description: 'Administrador' },
    { id: 2, description: 'Gerente' },
    { id: 3, description: 'Publicador' },
  ])
  .execute());
