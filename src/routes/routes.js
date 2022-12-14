const dimensionRoute = require('./impl/create-dimension/create-dimension-impl');
const datasetRoute = require('./impl/create-dataset/create-dataset-impl');
const eventRoute = require('./impl/create-event/create-event-impl');
const pipelineRoute = require('./impl/pipeline/pipeline-impl');

async function router(fastify, options, done) {
    fastify.post('/ingestion/event', async (req, res) => {
        try {
            const result = await eventRoute.executeQueryAndReturnResults(req);
            res.send(result);
        } catch (e) {
            console.error(`ingestion-routes./event: `, e);
            res.status(400).send('Bad Request ' + e.message);
        }
    });

    fastify.post('/ingestion/dataset', async (req, res) => {
        try {
            const result = await datasetRoute.executeQueryAndReturnResults(req);
            res.send(result);
        } catch (e) {
            console.error(`ingestion-routes./dataset: `, e);
            res.status(400).send('Bad Request ' + e.message);
        }
    });

    fastify.post('/ingestion/dimension', async (req, res) => {
        try {
            const result = await dimensionRoute.executeQueryAndReturnResults(req);
            res.send(result);
        } catch (e) {
            console.error(`ingestion-routes./dimension: `, e);
            res.status(400).send('Bad Request ' + e.message);
        }
    });

    fastify.post('/ingestion/pipeline', async (req, res) => {
        try {
            const result = await pipelineRoute.executeQueryAndReturnResults(req);
            res.send(result);
        } catch (e) {
            console.error(`ingestion-routes./pipeline: `, e);
            res.status(400).send('Bad Request ' + e.message);
        }
    });
    done();
}

module.exports = router;
