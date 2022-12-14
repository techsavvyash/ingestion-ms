const router = require('express').Router();
const genericFunction = require('../utils/genericFunctions');
let dimensionRoute = require('./impl/create-dimension/create-dimension-impl');
let datasetRoute = require('./impl/create-dataset/create-dataset-impl');
let eventRoute = require('./impl/create-event/create-event-impl');
let pipelineRoute = require('./impl/pipeline/pipeline-impl');

router.post('/event', async function (req, res) {
    try {
        const validateResult = await genericFunction.ajvValidator(req);
        if (validateResult.error && validateResult.error.length > 0) {
            res.status(200).json({code: 1000, message: validateResult.error});
        } else {
            const result = await addRequest.executeQueryAndReturnResults(req);
            res.send(result);
        }
    } catch (e) {
        console.error(`cash-routes./transaction_request: `, e);
        res.status(400).send(badRequest + e.message);
    }
});


module.exports = router;
