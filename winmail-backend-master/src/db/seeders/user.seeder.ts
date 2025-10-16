import { Connection, ObjectId } from 'mongoose';
import { connectDB } from '../../config/db';
import * as RoleRepository from '../../modules/role/role.repository';
import UserRepository from '../../modules/user/user.repository';
import { encryptPassword } from '../../utils/helper';

export type TUser = {
  name: string;
  username: string;
  email: string;
  password: string;
  role: ObjectId | string;
};

export const users: TUser[] = [
  {
    name: 'Prakhar Kapoor',
    username: 'kp99',
    email: 'prakharkapoorkp99@gmail.com',
    password: encryptPassword('Prakhar@123**'),
    role: '',
  },
  {
    name: 'CTO Sapmenc',
    username: 'cto99',
    email: 'tech.sapmenc@gmail.com',
    password: encryptPassword('Prakhar@123**'),
    role: '',
  },
  {
    name: 'CPO Sapmenc',
    username: 'cpo99',
    email: 'product.sapmenc@gmail.com',
    password: encryptPassword('Prakhar@123**'),
    role: '',
  },
];

const getAllRolesIds = async () => {
  try {
    const roles: any = await RoleRepository.findAllRoles();
    return roles.map((role: any) => role._id);
  } catch (err: any) {
    console.log(err);
    return err;
  }
};

export const seedUsers = async () => {
  try {
    const roles = await getAllRolesIds();

    for (const [index, user] of users.entries()) {
      user.role = roles[index];
      await UserRepository.createUser(user);
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

export const seedUsersData = async () => {
  const conn: void | Connection = await connectDB({
    explicitClose: true,
  });
  await seedUsers();
  if (conn instanceof Connection) {
    conn.close();
  }
  console.log('Users seeded successfully');
};

seedUsersData();
