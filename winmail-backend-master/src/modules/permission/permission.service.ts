import * as PermissionRepository from './permission.repository';

export const createPermission = async (permission: any) => {
  try {
    const newPermission =
      await PermissionRepository.createPermission(permission);
    return newPermission;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getAllPermissions = async () => {
  try {
    const permissions = await PermissionRepository.findAllPermissions();
    return permissions;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getPermissionById = async (id: string) => {
  try {
    const permission = await PermissionRepository.findPermissionById(id);
    return permission;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const updatePermission = async (id: string, updatedPermission: any) => {
  try {
    const permission = await PermissionRepository.updatePermission(
      id,
      updatedPermission
    );
    return permission;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const deletePermission = async (id: number) => {
  try {
    const permission = await PermissionRepository.deletePermission(id);
    return permission;
  } catch (err) {
    console.log(err);
    return err;
  }
};
