import { Request, Response } from 'express';
import * as PermissionService from './permission.service';

export const createPermission = async (req: Request, res: Response) => {
  const permission = req.body;
  const createdPermission =
    await PermissionService.createPermission(permission);
  res.status(201).json(createdPermission);
};

export const getAllPermissions = (req: Request, res: Response): void => {
  const permissions = PermissionService.getAllPermissions();
  res.status(200).json(permissions);
};

export const getPermissionById = async (req: Request, res: Response) => {
  const permission = PermissionService.getPermissionById(req.params.id);
  if (permission) {
    res.status(200).json({
      status: true,
      message: 'Permission found',
      data: permission,
    });
  } else {
    res.status(404).json({
      status: false,
      message: 'Permission not found',
      data: null,
    });
  }
};

export const updatePermission = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedPermission = req.body;
  const permission = PermissionService.updatePermission(id, updatedPermission);
  if (permission) {
    res.status(200).json(permission);
  } else {
    res.status(404).json({ message: 'Permission not found' });
  }
};

export const deletePermission = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const success = await PermissionService.deletePermission(id);
  if (success) {
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Permission not found' });
  }
};
