const router = require('express').Router();
const dimensionRoute = require('./impl/create-dimension/create-dimension-impl');
const datasetRoute = require('./impl/create-dataset/create-dataset-impl');
const eventRoute = require('./impl/create-event/create-event-impl');
const pipelineRoute = require('./impl/pipeline/pipeline-impl');

router.post('/event', async function (req, res) {
    try {
        const result = await eventRoute.executeQueryAndReturnResults(req);
        res.send(result);
    } catch (e) {
        console.error(`ingestion-routes./event: `, e);
        res.status(400).send('Bad Request ' + e.message);
    }
});

router.post('/dataset', async function (req, res) {
    try {
        const result = await datasetRoute.executeQueryAndReturnResults(req);
        res.send(result);
    } catch (e) {
        console.error(`ingestion-routes./dataset: `, e);
        res.status(400).send('Bad Request ' + e.message);
    }
});

router.post('/dimension', async function (req, res) {
    try {
        const result = await dimensionRoute.executeQueryAndReturnResults(req);
        res.send(result);
    } catch (e) {
        console.error(`ingestion-routes./dimension: `, e);
        res.status(400).send('Bad Request ' + e.message);
    }
});

router.post('/pipeline', async function (req, res) {
    try {
        const result = await dimensionRoute.executeQueryAndReturnResults(req);
        res.send(result);
    } catch (e) {
        console.error(`ingestion-routes./dimension: `, e);
        res.status(400).send('Bad Request ' + e.message);
    }
});


module.exports = router;
