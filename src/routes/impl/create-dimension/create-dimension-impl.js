const {query, pool} = require('../../../utils/dbConfig');
const genericFunction = require('../../../utils/genericFunctions');
const dimensionQueries = require('../../../queries/dimension_queries');

module.exports = {
    executeQueryAndReturnResults: async (req) => {
        try {
            const reqBody = req.body;
            const dimensionName = reqBody.dimension_name;
            const queryStr = await dimensionQueries.getDimensionSpec(dimensionName);
            const queryResult = await query(queryStr.query, queryStr.values);
            if (queryResult.rowCount === 1) {
                const isValidSchema = await genericFunction.ajvValidator(queryResult.rows[0].dimension_data.input, reqBody);
                if (!isValidSchema.errors) {
                    await genericFunction.writeToCSVFile(dimensionName, [reqBody.dimension]);
                    return {
                        message: "Dimension Added Successfully"
                    }
                } else {
                    return isValidSchema
                }
            } else {
                return {
                    message: "No Dimension Found"
                }
            }
        } catch (e) {
            console.error('create-dimension-impl.executeQueryAndReturnResults: ', e.message);
            throw new Error(e);
        }
    }
};