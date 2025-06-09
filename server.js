require('dotenv').config();
const express = require('express');
const { sequelize } = require('./src/models');
const setupSwagger = require('./src/config/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
const bodyParser = require('body-parser');
app.use(bodyParser.json({ type: 'application/json', limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Configurar Swagger
setupSwagger(app);

// Testar conexão com o banco de dados
sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    
    // Sincronizar modelos com o banco de dados
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Modelos sincronizados com o banco de dados.');
    
// Iniciar servidor apenas se não for teste
    let server;
    if (process.env.NODE_ENV !== 'test') {
      server = app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
      });
    }
    return server;
  })
  .catch(err => {
    console.error('Erro ao conectar com o banco de dados:', err);
  });

// Configurar rotas
const userRoutes = require('./src/routes/userRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const productRoutes = require('./src/routes/productRoutes');

// Prefixo /v1 para todas as rotas
app.use('/v1/user', userRoutes);
app.use('/v1/category', categoryRoutes);
app.use('/v1/product', productRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Exportar app para testes
module.exports = app;
