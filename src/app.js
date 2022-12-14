require('dotenv').config();

const fastify = require('fastify')({ logger: false });
const PORT = 8080;
fastify.register(require('./routes/routes'));

const start = async () => {
    try {
        await fastify.listen(PORT)
    }
    catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
}

start();