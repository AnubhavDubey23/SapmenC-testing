import { Router } from 'express';
import * as PermissionController from './permission.controller';

const router = Router();

router.post('/permissions', PermissionController.createPermission);
router.get('/permissions', PermissionController.getAllPermissions);
router.get('/permissions/:id', PermissionController.getPermissionById);
router.patch('/permissions/:id', PermissionController.updatePermission);
router.delete('/permissions/:id', PermissionController.deletePermission);

export default router;
