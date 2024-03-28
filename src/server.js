const App = require('./app');
const { validateEnv } = require('./utils/index.util');
const serverless = require("serverless-http");

validateEnv();

const app = new App();

module.exports.handler = serverless(app);
