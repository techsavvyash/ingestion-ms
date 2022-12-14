const express = require('express');
const { Client } =  require('pg');
const bodyParser = require('body-parser');
const app =  express();
app.use(bodyParser.json());
var dimensionRoutes = require('./impl/create-diemension/create-dimension-impl')
var datasetRoutes = require('./impl/create-dataset/create-dataset-impl')
var eventRoutes = require('./impl/create-event/create-event-impl');
var pipelineRoutes = require('./impl/pipeline/pipeline-impl');
app.use('/ingestion',dimensionRoutes);
app.use('/ingestion',datasetRoutes);
app.use('/ingestion',eventRoutes);
app.use('/ingestion',pipelineRoutes);

app.listen(3000);
