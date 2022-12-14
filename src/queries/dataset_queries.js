module.exports = {
    getDatasetSpec: async (datasetName) => {
        const queryStr = `SELECT dataset_data FROM spec.dataset WHERE dataset_name = $1`;
        return {query: queryStr, values: [datasetName]};
    }
};