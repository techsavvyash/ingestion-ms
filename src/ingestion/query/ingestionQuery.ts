export const IngestionDatasetQuery = {
    async getDataset(datasetName) {
        const queryStr = `SELECT dataset_data FROM spec.dataset WHERE dataset_name = $1`;
        return {query: queryStr, values: [datasetName]};
    },
    async getDimension(dimensionName) {
        const queryStr = `SELECT dimension_data FROM spec.dimension WHERE dimension_name = $1`;
        return {query: queryStr, values: [dimensionName]};
    },
    async getEvents(eventName) {
        const queryStr = `SELECT event_data FROM spec.event WHERE event_name = $1`;
        return {query: queryStr, values: [eventName]};
    },
    async getPipelineSpec(pipelineName) {
        const queryStr = `SELECT transformer_file, event_name, dataset_name
        FROM spec.pipeline
        LEFT JOIN spec.event ON event.pid = pipeline.event_pid
        LEFT JOIN spec.dataset ON dataset.pid  = pipeline.dataset_pid
        LEFT JOIN spec.transformer ON transformer.pid = pipeline.transformer_pid
        WHERE pipeline_name = $1`;
        return {query: queryStr, values: [pipelineName]};
    },
    async createFileTracker(fileName, ingestionType, ingestionName, fileSize) {
        const queryStr = `INSERT INTO ingestion.file_tracker(filename, ingestion_type, ingestion_name, file_status, filesize)
	                       VALUES ($1, $2, $3, $4, $5) RETURNING pid`;
        return {query: queryStr, values: [fileName, ingestionType, ingestionName, 'Upload_in_progress', fileSize]};
    },
    async updateFileTracker(pid, fileStatus) {
        const queryStr = `UPDATE ingestion.file_tracker
            SET file_status = $2,
            updated_at = CURRENT_TIMESTAMP
            WHERE pid = $1`;
        return {query: queryStr, values: [pid, fileStatus]};
    },
    async getFileStatus(fileName,ingestionType,ingestionName) {
        const queryStr = `SELECT pid,file_status,created_at FROM ingestion.file_tracker WHERE uploaded_file_name = $1 AND ingestion_type=$2 AND ingestion_name = $3 `;
        return {query: queryStr, values: [fileName,ingestionType,ingestionName]};
    }
};