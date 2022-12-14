module.exports = {
    getDimensionSpec: async (dimensionName) => {
        const queryStr = `SELECT dimension_data FROM spec.dimension WHERE dimension_name = $1`;
        return {query: queryStr, values: [dimensionName]};
    }
};