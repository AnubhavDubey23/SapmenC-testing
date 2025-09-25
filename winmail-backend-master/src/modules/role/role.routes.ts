import { Router } from 'express';
import * as RoleController from './role.controller';

const router = Router();

router.post('/', RoleController.createRole);
router.get('/', RoleController.getAllRoles);
router.get('/roles/:id', RoleController.getRoleById);
router.patch('/roles/:id', RoleController.updateRole);
router.delete('/roles/:id', RoleController.deleteRole);

export default router;
