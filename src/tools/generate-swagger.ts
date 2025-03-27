// src/tools/generate-swagger.ts

import swaggerJSDoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Inventory Microservice API',
    version: '1.0.0',
    description: 'Documentación de la API del microservicio de inventario de GR',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local de desarrollo',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    path.join(__dirname, '../interfaces/api/controllers/*.ts'),
    path.join(__dirname, '../shared/responseHandler.ts'),
  ],
};

const swaggerSpec = swaggerJSDoc(options);

fs.writeFileSync(path.join(__dirname, '../interfaces/api/swagger.json'), JSON.stringify(swaggerSpec, null, 2));

console.log('✅ Swagger generado correctamente');
