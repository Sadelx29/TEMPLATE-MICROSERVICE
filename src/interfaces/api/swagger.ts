// src/interfaces/api/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Inventory Service API',
      version: '1.0.0',
      description: 'API para gestionar el inventario de materiales por tienda',
    },
    servers: [
      {
        url: 'http://localhost:3000', // cambia esto si usas otro host
      },
    ],
  },
  apis: ['./src/interfaces/api/controllers/*.ts'], // 👈 donde están tus anotaciones JSDoc
});
