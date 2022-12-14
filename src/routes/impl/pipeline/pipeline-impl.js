const {query, pool} = require('../../../utils/dbConfig');
const genericFunction = require('../../../utils/genericFunctions');
const pipelineQueries = require('../../../queries/pipeline_queries');

const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

module.exports = {
    executeQueryAndReturnResults: async (req) => {
        try {
            const pipelineName = req.body.pipeline_name;
            let queryStr = await pipelineQueries.getPipelineSpec(pipelineName);
            let queryResult = await query(queryStr.query, queryStr.values);
            if (queryResult.rowCount === 1) {
            }
            else {
                return {
                    message: "No Pipeline Found"
                }
            }
        } catch (e) {

            throw new Error(e);
        }
    }
};
