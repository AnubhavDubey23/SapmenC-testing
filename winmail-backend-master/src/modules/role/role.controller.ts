import { Request, Response } from 'express';
import * as RoleService from './role.service';

export const createRole = async (req: Request, res: Response) => {
  try {
    const role = await RoleService.createRole(req.body);
    res.status(201).json({
      status: true,
      message: 'Role created',
      data: role,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const roles = await RoleService.getAllRoles();
    res.status(200).json(roles);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const getRoleById = async (req: Request, res: Response) => {
  try {
    const role = await RoleService.getRoleById(req.params.id);
    res.status(200).json(role);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const role = await RoleService.updateRole(req.params.id, req.body);
    res.status(200).json(role);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const role = await RoleService.deleteRole(req.params.id);
    res.status(204).json(role);
  } catch (err) {
    res.status(400).json(err);
  }
};
