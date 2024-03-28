const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const { Model } = require('objection');
const { NODE_ENV, PORT } = require('./config/env');
const knex = require('./databases');
const errorMiddleware = require('./middlewares/error.middleware');
const routes = require('./routes/index.route');

class App {
  constructor() {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 80;
    this.initializeDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`=================================`);
      console.log(`======= ENV: ${this.env} =======`);
      console.log(`🚀 App listening on the port ${this.port}`);
      console.log(`=================================`);
    });
  }

  getApp() {
    return this.app;
  }

  initializeDatabase() {
    Model.knex(knex);
  }

  async initializeMiddlewares() {
    morgan.token('body', (req, res) => JSON.stringify(req.body));

    this.app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));
    this.app.use(cors({ origin: '*', credentials: true, exposedHeaders: [] }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.text({ limit: '50mb' }));
    this.app.use(express.urlencoded({ limit: '50mb', extended: true }));
  }

  initializeRoutes() {
    this.app.use("/", routes);
    this.app.use("/health", (_, res) => res.sendStatus(200));
    this.app.use((req, res) => res.status(404).send({ status: 'error', message: `${req.method} ${req.originalUrl} Not Found` }));
  }

  initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

module.exports = App;
