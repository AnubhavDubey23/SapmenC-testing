import { ObjectId } from 'mongoose';
import * as RoleRepository from './role.repository';

export const createRole = async (role: any) => {
  try {
    const newRole = await RoleRepository.createRole(role);
    return newRole;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getAllRoles = async () => {
  try {
    const roles = await RoleRepository.findAllRoles();
    return roles;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getRoleById = async (id: string) => {
  try {
    const role = await RoleRepository.findRoleById(id);
    return role;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const updateRole = async (id: string, updatedRole: any) => {
  try {
    const role = await RoleRepository.updateRole(id, updatedRole);
    return role;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const deleteRole = async (id: string | ObjectId) => {
  try {
    const role = await RoleRepository.deleteRole(id);
    return role;
  } catch (err) {
    console.log(err);
    return err;
  }
};
