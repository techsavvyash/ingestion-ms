const {query, pool} = require('../../../utils/dbConfig');
const genericFunction = require('../../../utils/genericFunctions');
const specData = require('../../../utils/spec-data');

module.exports = {
    executeQueryAndReturnResults: async (req) => {
        try {
            const reqBody = req.body;
            const datasetName = reqBody.dataset_name;
            const schema = specData.properties.find(obj => obj.ingestion_type === 'dataset');
            const isValidSchema = await genericFunction.ajvValidator(schema.input, reqBody);
            if (!isValidSchema.errors) {
                await genericFunction.writeToCSVFile(datasetName, [reqBody.event]);
                return {
                    message: "Dataset Added Successfully"
                }
            } else {
                return isValidSchema
            }

        } catch (e) {
            console.error('create-dataset-impl.executeQueryAndReturnResults: ', e.message);
            throw new Error(e);
        }
    }
};