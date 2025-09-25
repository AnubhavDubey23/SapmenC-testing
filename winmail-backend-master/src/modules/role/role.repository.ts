import { ObjectId } from 'mongoose';
import roleModel, { IRole } from './role.model';

export const createRole = async (role: any, bulk = false): Promise<IRole> => {
  try {
    const newRole = await roleModel.create(role);
    return newRole;
  } catch (err) {
    throw err;
  }
};

export const findAllRoles = async (): Promise<IRole[]> => {
  try {
    const roles = await roleModel.find();
    return roles;
  } catch (err) {
    throw err;
  }
};

export const findRoleById = async (id: string): Promise<IRole | null> => {
  try {
    const role = await roleModel.findById(id);
    return role;
  } catch (err) {
    throw err;
  }
};

export const updateRole = async (
  id: string,
  updatedRole: any
): Promise<IRole | null> => {
  try {
    const role = await roleModel.findByIdAndUpdate(id, updatedRole, {
      new: true,
    });
    return role;
  } catch (err) {
    throw err;
  }
};

export const deleteRole = async (
  id: string | ObjectId
): Promise<IRole | null> => {
  try {
    const role = await roleModel.findByIdAndDelete(id);
    return role;
  } catch (err) {
    throw err;
  }
};

export const findRoleByName = async (name: string): Promise<IRole | null> => {
  try {
    const role = await roleModel.findOne({ name });
    return role;
  } catch (err) {
    throw err;
  }
};
