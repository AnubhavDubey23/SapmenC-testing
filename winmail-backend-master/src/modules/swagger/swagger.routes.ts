import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const router = Router();

router.use('/', swaggerUi.serve);
router.get(
  '/',
  swaggerUi.setup(
    swaggerJsdoc({
      apis: ['src/modules/**/*.routes.ts'],
      definition: {
        info: {
          title: 'WinMac API Documentation',
          version: '1.0.0',
          description:
            'This is a simple CRUD API application made with Express and TypeScript',
          contact: {
            email: 'prakharkapoorkp99@gmail.com',
            name: 'Prakhar Kapoor',
            url: 'https://github.com/kapoorp99',
          },
        },
        basePath: '/',
        consumes: ['application/json'],
        host: 'http://localhost:5002/api/v1',
        schemes: ['http:localhost:5002/api/v1', 'https:localhost:5002'],
        produces: ['application/json'],
        tags: [
          {
            name: 'User',
            description: 'User related endpoints',
          },
          {
            name: 'Auth',
            description: 'Authentication related endpoints',
          },
          {
            name: 'Role',
            description: 'Role related endpoints',
          },
          {
            name: 'Permission',
            description: 'Permission related endpoints',
          },
          {
            name: 'Segment',
            description: 'Segment related endpoints',
          },
          {
            name: 'Template',
            description: 'Template related endpoints',
          },
        ],
      },
    }),
    {
      explorer: true,
    }
  )
);

export default router;
