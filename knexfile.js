const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} = require('./src/config/env');

const dbConfig = {
  client: 'mysql2',
  connection: {
    charset: 'utf8',
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    multipleStatements: true,
  },
  migrations: {
    directory: 'src/databases/migrations',
    tableName: 'migrations',
  },
  seeds: {
    directory: 'src/databases/seeds',
  },
};

module.exports = dbConfig;
