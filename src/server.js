const config = require("./config");
const services = require("./services/services")({ config });
const routes = require("./routes");
const mongoose = require('mongoose');


// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true });

fastify.register(require('fastify-swagger'), {
  exposeRoute: true,
  routePrefix: '/docs',
  swagger: {
    info: { title: 'Wallets' },
  },
})

const mongo_url = process.env.MONGODB_URL || 'mongodb+srv://admin:grupo1@fiuberwalletsdev.qy29k8l.mongodb.net/?retryWrites=true&w=majority'
const mongo_db_name = process.env.MONGODB_NAME || 'fiuber'

// Connect fastify to mongoose
mongoose
  .connect(mongo_url, {dbName: mongo_db_name})
  .then(() => {
  console.log('Connected to the Database.');
  })
  .catch(err => console.error(err));


// Declares routes
routes.forEach(route => fastify.route(route({ config, services })));

// Run the server!
const start = async () => {
  fastify.listen(process.env.PORT || 3000, '0.0.0.0', function (err, address) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    fastify.log.info(`server listening on ${address}`)
  });
};
start();
