const {query, pool} = require('../../../utils/dbConfig');
const genericFunction = require('../../../utils/genericFunctions');
const datasetQueries = require('../../../queries/dataset_queries');

module.exports = {
    executeQueryAndReturnResults: async (req) => {
        try {
            const reqBody = req.body;
            const datasetName = reqBody.dataset_name;
            const queryStr = await datasetQueries.getDatasetSpec(datasetName);
            const queryResult = await query(queryStr.query, queryStr.values);
            if (queryResult.rowCount === 1) {
                const isValidSchema = await genericFunction.ajvValidator(queryResult.rows[0].dataset_data.input, reqBody);
                if (!isValidSchema.errors) {
                    await genericFunction.writeToCSVFile(datasetName, [reqBody.dataset]);
                    return {
                        message: "Dataset Added Successfully"
                    }
                } else {
                    return isValidSchema
                }
            } else {
                return {
                    message: "No Dataset Found"
                }
            }
        } catch (e) {
            console.error('create-dataset-impl.executeQueryAndReturnResults: ', e.message);
            throw new Error(e);
        }
    }
};