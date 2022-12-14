const {query, pool} = require('../../../utils/dbConfig');
const genericFunction = require('../../../utils/genericFunctions');
const specData = require('../../../utils/spec-data');

module.exports = {
    executeQueryAndReturnResults: async (req) => {
        try {
            const reqBody = req.body;
            const eventName = reqBody.event_name;
            const schema = specData.properties.find(obj => obj.ingestion_type === 'event');
            const isValidSchema = await genericFunction.ajvValidator(schema.input, reqBody);
            if (!isValidSchema.errors) {
                const response = await genericFunction.writeToCSVFile(eventName, [reqBody.event])
            } else {
                return isValidSchema
            }

        } catch (e) {
            console.error('create-event-impl.executeQueryAndReturnResults: ', e.message);
            throw new Error(e);
        }
    }
};