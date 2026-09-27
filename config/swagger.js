import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  failOnErrors: true,

  definition: {
    openapi: '3.0.0',

    info: {
      title: 'Helios Issue Tracker API',
      version: '1.0.0',
      description: 'API documentation for the Helios Issue Tracker.',
    },

    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local development server',
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
  },

  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
