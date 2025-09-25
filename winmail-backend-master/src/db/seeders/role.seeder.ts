import { Connection, ObjectId } from 'mongoose';
import { connectDB } from '../../config/db';
import * as RoleRepository from '../../modules/role/role.repository';
import * as PermissionRepository from '../../modules/permission/permission.repository';

export type TRole = {
  name: string;
  description: string;
  permissions: ObjectId[] | string[];
};

const getAllPermissionsIds = async () => {
  try {
    const permissionsIds: any = await PermissionRepository.findAllPermissions();
    return permissionsIds.map((permission: any) => permission._id);
  } catch (err: any) {
    console.log(err);
    return err;
  }
};

const getRandomPermissionsIds = (arr: any) => {
  const randomPermissions = arr.sort(() => 0.5 - Math.random());
  return randomPermissions.slice(
    0,
    Math.floor(Math.random() * randomPermissions.length)
  );
};

export const seedRoles = async () => {
  try {
    const permissions = await getAllPermissionsIds();

    const roles: TRole[] = [
      {
        name: 'Super Admin',
        description: 'Super Admin role',
        permissions: getRandomPermissionsIds(permissions),
      },
      {
        name: 'Admin',
        description: 'Admin role',
        permissions: getRandomPermissionsIds(permissions),
      },
      {
        name: 'User',
        description: 'User role',
        permissions: getRandomPermissionsIds(permissions),
      },
      {
        name: 'Guest',
        description: 'Guest role',
        permissions: getRandomPermissionsIds(permissions),
      },
    ];

    for (const role of roles) {
      await RoleRepository.createRole(role, true);
    }
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};

export const seedRolesData = async () => {
  const conn: void | Connection = await connectDB({
    explicitClose: true,
  });
  await seedRoles();
  if (conn instanceof Connection) {
    conn.close();
  }
  console.log('Roles seeded successfully');
};

seedRolesData();
