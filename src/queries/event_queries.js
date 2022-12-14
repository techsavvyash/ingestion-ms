module.exports = {
    getEventSpec: async (event_name) => {
        const queryStr = `SELECT event_data FROM spec.event WHERE event_name = $1`;
        return {query: queryStr, values: [event_name]};
    }
};