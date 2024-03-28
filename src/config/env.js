const { config } = require('dotenv');
config({ path: `.env`, debug: true });

module.exports = {
  NODE_ENV,
  PORT,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  OPENAI_API_KEY,
  ANTHROPIC_API_KEY
} = process.env;
