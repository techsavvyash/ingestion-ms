const {query, pool} = require('../../../utils/dbConfig');
const genericFunction = require('../../../utils/genericFunctions');
const eventQueries = require('../../../queries/event_queries');

module.exports = {
    executeQueryAndReturnResults: async (req) => {
        try {
            const reqBody = req.body;
            const eventName = reqBody.event_name;
            const queryStr = await eventQueries.getEventSpec(eventName);
            const queryResult = await query(queryStr.query, queryStr.values);
            if (queryResult.rowCount === 1) {
                const isValidSchema = await genericFunction.ajvValidator(queryResult.rows[0].event_data.input, reqBody);
                if (!isValidSchema.errors) {
                    await genericFunction.writeToCSVFile(eventName, [reqBody.event]);
                    return {
                        message: "Event Added Successfully"
                    }
                } else {
                    return isValidSchema
                }
            } else {
                return {
                    message: "No Event Found"
                }
            }
        } catch (e) {
            console.error('create-event-impl.executeQueryAndReturnResults: ', e.message);
            throw new Error(e);
        }
    }
};