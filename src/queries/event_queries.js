module.exports = {
    getEventSpec: async (eventName) => {
        const queryStr = `SELECT event_data FROM spec.event WHERE event_name = $1`;
        return {query: queryStr, values: [eventName]};
    }
};