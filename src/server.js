const App = require('./app');
const { validateEnv } = require('./utils/index.util');

validateEnv();

const app = new App();

app.listen();
