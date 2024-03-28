const Knex = require('knex');
const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} = require('../config/env');

const db = Knex({
  client: 'mysql2',
  useNullAsDefault: true,
  connection: {
    charset: 'utf8',
    host: DATABASE_HOST,
    port: Number(DATABASE_PORT),
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME
  },
  pool: {
    min: 2,
    max: 10,
  },
});

module.exports = db;
