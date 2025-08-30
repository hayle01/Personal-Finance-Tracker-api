import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Personal Finance Tracker',
      version: '1.0.0',
      description: 'API documentation for Personal Finance Tracker'
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://personal-finance-tracker-api-tcxh.onrender.com'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js']
};

export const swaggerSpec = swaggerJSDoc(options);