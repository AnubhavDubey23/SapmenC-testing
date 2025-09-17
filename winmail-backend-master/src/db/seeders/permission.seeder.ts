import { Connection } from 'mongoose';
import { connectDB } from '../../config/db';
import * as PermissionRepository from '../../modules/permission/permission.repository';

export const seedPermissions = async () => {
  const permissions = [
    { name: 'create user', description: 'Create a user' },
    { name: 'read user', description: 'Read a user' },
    { name: 'update user', description: 'Update a user' },
    { name: 'delete user', description: 'Delete a user' },
    { name: 'create role', description: 'Create a role' },
    { name: 'read role', description: 'Read a role' },
    { name: 'update role', description: 'Update a role' },
    { name: 'delete role', description: 'Delete a role' },
    { name: 'create permission', description: 'Create a permission' },
    { name: 'read permission', description: 'Read a permission' },
    { name: 'update permission', description: 'Update a permission' },
    { name: 'delete permission', description: 'Delete a permission' },
    { name: 'create segment', description: 'Create a segment' },
    { name: 'read segment', description: 'Read a segment' },
    { name: 'update segment', description: 'Update a segment' },
    { name: 'delete segment', description: 'Delete a segment' },
    { name: 'create template', description: 'Create a template' },
    { name: 'read template', description: 'Read a template' },
    { name: 'update template', description: 'Update a template' },
    { name: 'delete template', description: 'Delete a template' },
  ];

  for (const permission of permissions) {
    await PermissionRepository.createPermission(permission, true);
  }
};

export const seedPermissionsData = async () => {
  const conn: void | Connection = await connectDB({
    explicitClose: true,
  });
  await seedPermissions();
  if (conn instanceof Connection) {
    conn.close();
  }
  console.log('Permissions seeded successfully');
};

seedPermissionsData();
