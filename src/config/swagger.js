const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Produtos',
      version: '1.0.0',
      description: 'API para gerenciamento de produtos, categorias e usuários'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local'
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
    }
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', 
    swaggerUi.serve,
    (req, res, next) => {
      swaggerUi.setup(specs)(req, res, (err) => {
        if (err) {
          console.error('Erro ao configurar Swagger UI:', err);
          return res.status(500).json({ error: 'Erro ao carregar documentação' });
        }
        next();
      });
    }
  );
  
  // Rota adicional para garantir que a documentação seja acessível
  app.get('/api-docs', (req, res) => {
    res.redirect('/api-docs/index.html');
  });
};
