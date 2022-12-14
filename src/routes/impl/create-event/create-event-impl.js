const {query, pool} = require('../../../utils/dbConfig');
const genericFunction = require('../../../utils/genericFunctions');
const specData = require('../../../utils/spec-data');

module.exports = {
    executeQueryAndReturnResults: async (req) => {
        try {
            const reqBody = req.body;
            const eventName = reqBody.event;
            const schema = specData.properties.find(obj => obj.ingestion_type == 'event');
            if (await genericFunction.ajvValidator(schema.input, reqBody)) {
                const response = await genericFunction.writeToCSVFile(eventName, reqBody)
            } else {

            }

        } catch (e) {
            console.error('create-event-impl.executeQueryAndReturnResults: ', e.message);
            throw new Error(e);
        }
    }
};