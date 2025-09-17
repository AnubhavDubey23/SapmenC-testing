import PermissionModel from './permission.model';
export const createPermission = async (
  permission: any,
  bulk: boolean = false
) => {
  try {
    if (bulk) {
      const newPermission = await PermissionModel.insertMany(permission);
      return newPermission;
    }
    const newPermission = await PermissionModel.create(permission);
    return newPermission;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const findAllPermissions = async () => {
  try {
    const permissions = await PermissionModel.find();
    return permissions;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const findPermissionById = async (id: string) => {
  try {
    const permission = await PermissionModel.findById(id);
    return permission;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const updatePermission = async (id: string, updatedPermission: any) => {
  try {
    const permission = await PermissionModel.findByIdAndUpdate(
      id,
      updatedPermission,
      {
        new: true,
      }
    );
    return permission;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const deletePermission = async (id: number) => {
  try {
    const permission = await PermissionModel.findByIdAndDelete(id);
    return permission;
  } catch (err) {
    console.log(err);
    return err;
  }
};
