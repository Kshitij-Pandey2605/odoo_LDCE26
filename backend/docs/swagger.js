import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GlobeTrotter Backend API',
      version: '1.0.0',
      description: 'Production-ready REST API for GlobeTrotter AI Travel Platform',
      contact: {
        name: 'Backend Engineering Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
