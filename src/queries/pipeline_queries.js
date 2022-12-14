module.exports = {
    getPipelineSpec: async (pipelineName) => {
        const queryStr = `SELECT event_name, dataset_name
        FROM spec.pipeline
        LEFT JOIN spec.event ON event.pid = pipeline.event_pid
        LEFT JOIN spec.dataset ON dataset.pid  = pipeline.dataset_pid
        WHERE pipeline_name = $1`;
        return {query: queryStr, values: [pipelineName]};
    }
};