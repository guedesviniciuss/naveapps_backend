import { createConnection, getConnection } from 'typeorm';

import Profiles from '../models/Profile';

import userLevel from '../config/permissions';

createConnection().then(() => getConnection()
  .createQueryBuilder()
  .insert()
  .into(Profiles)
  .onConflict('("id") DO NOTHING')
  .values([
    { id: userLevel.permission.NORMAL_USER, description: 'NORMAL_USER' },
    { id: userLevel.permission.ADMIN, description: 'ADMIN' },
    { id: userLevel.permission.MAINTAINER, description: 'MAINTAINER' },
  ])
  .execute());
