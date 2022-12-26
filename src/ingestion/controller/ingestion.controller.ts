import { Dataset, Dimension, IEvent, Pipeline } from './../interfaces/Ingestion-data';
import { Body, Controller, Post } from '@nestjs/common';
import { DatasetService } from '../services/dataset/dataset.service';
import { DimensionService } from '../services/dimension/dimension.service';
import { EventService } from '../services/event/event.service';
import { PipelineService } from '../services/pipeline/pipeline.service';
@Controller('ingestion')
export class IngestionController {
    constructor(
        private datasetservice: DatasetService, private dimesionService: DimensionService
        , private eventService: EventService, private pipelineService: PipelineService) { }
    @Post('/dataset')
    async createDataset(@Body() inputData:Dataset) {
        try {
            return await this.datasetservice.createDataset(inputData);
        }
        catch (e) {
            console.error('create-dataset-impl: ', e.message);
            throw new Error(e);
        }
    }
    @Post('/dimension')
    async createDimenshion(@Body() inputData: Dimension) {
        try {
            return await this.dimesionService.createDimenshion(inputData);
        } catch (e) {
            console.error('create-dimension-impl: ', e.message);
            throw new Error(e);
        }
    }
    @Post('/event')
    async createEvent(@Body() inputData: IEvent) {
        try {
            return await this.eventService.createEvent(inputData)
        } catch (e) {
            console.error('create-event-impl: ', e.message);
            throw new Error(e);
        }
    }
    @Post('/pipeline')
    async pipeline(@Body() pipelineData: Pipeline) {
        try {
            return await  this.pipelineService.pipeline(pipelineData);
        }
        catch (e) {
            console.error('create-pipeline-impl: ', e.message);
            throw new Error(e);
        }
    }
}
