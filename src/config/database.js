require('dotenv').config();
const { Sequelize } = require('sequelize');

let sequelize;
if (process.env.NODE_ENV === 'test') {
  // Usar SQLite em memória para testes
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    }
  });
} else if (process.env.NODE_ENV === 'development') {
  // Usar SQLite para desenvolvimento
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: console.log,
    define: {
      timestamps: true,
      underscored: true,
    }
  });
} else {
  // Usar MySQL para produção
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'mysql',
      logging: false,
      define: {
        timestamps: true,
        underscored: true,
      },
    }
  );
}

module.exports = sequelize;
