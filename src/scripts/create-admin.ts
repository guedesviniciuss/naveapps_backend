import { createConnection, getConnection } from 'typeorm';
import minimist from 'minimist';
import { hash } from 'bcryptjs';

import User from '../models/User';

let {
  name, email, user_profile,
} = minimist(process.argv.slice(2));

const { password } = minimist(process.argv.slice(2));

name = name.toLowerCase();
email = email.toLowerCase();
user_profile = user_profile.toUpperCase();

async function createAdmin() {
  const hashedPassword = await hash(password.toString(), 8);

  if (!name || !email || !password || !user_profile) {
    return process.on('exit', () => console.log(`\nIt was not possible to create the user, check the fields: \n name: ${name}, \n email: ${email}, \n password: ${password}, \n user_profile: ${user_profile}`));
  }

  switch (user_profile) {
    case 'NORMAL_USER':
      user_profile = 1;
      break;
    case 'ADMIN':
      user_profile = 1024;
      break;
    case 'MAINTANER':
      user_profile = 2048;
      break;
    default:
      return process.on('exit', () => console.log(`\nType of user submitted does not exist, verify type: '${user_profile}'`));
  }

  const query = {
    name, email, password: hashedPassword, user_profile, status: true,
  };

  return createConnection().then(() => getConnection()
    .createQueryBuilder()
    .insert()
    .into(User)
    .values(query)
    .onConflict('("email") DO UPDATE SET name = EXCLUDED."name", password = EXCLUDED."password", user_profile = EXCLUDED."user_profile"')
    .execute()
    .then(() => process.on('exit', (code) => console.log(`\nuser was created successfully with code ${code}`))));
}

createAdmin();
