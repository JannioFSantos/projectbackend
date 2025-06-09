module.exports = {
  development: {
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: console.log,
    define: {
      timestamps: true,
      underscored: true,
    },
    dialectModule: require('sqlite3')
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    }
  },
  production: {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    }
  }
};
