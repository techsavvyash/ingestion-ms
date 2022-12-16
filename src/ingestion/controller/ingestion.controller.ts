import { Body, Controller, Post } from '@nestjs/common';
import { IngestionService } from '../services/ingestion.service';
import { IngestionDatasetQuary } from '../query/ingestionQuary';
import { DatabaseService } from 'src/database/database.service';

@Controller('ingestion')
export class IngestionController {

    constructor(private service: IngestionService, private DatabaseService: DatabaseService) { }
    @Post('dataset')
    async createDataset(@Body() inputData) {
        try {
            const datasetName = inputData.dataset_name;
            console.log(datasetName);
            const queryStr = await IngestionDatasetQuary.getDataset(datasetName);
            const queryResult = await this.DatabaseService.executeQuery(queryStr.query, queryStr.values);
            if (queryResult.length === 1) {
                const isValidSchema = await this.service.ajvValidator(queryResult[0].dataset_data.input, inputData);
                console.log(queryResult[0].dataset_data.input.properties.dataset.properties);
                console.log("Input data",inputData);
                if (!isValidSchema['message']) {
                    await this.service.writeToCSVFile(datasetName, [inputData.dataset]);
                    return {
                        message: "Dataset Added Successfully"
                    }
                }
                else {
                    console.log(isValidSchema);
                    return isValidSchema['message']

                }
            }
            else {
                return {
                    message: "No Dataset Found"
                }
            }
        }

        catch (e) {
            console.error('create-dataset.: ', e.message);
            throw new Error(e);
        }

    }

    @Post('dimension')
    async createDimenshion(@Body() inputData) {
        try {

            const dimensionName = inputData.dimension_name;
            const queryStr = await IngestionDatasetQuary.getDimesnsion(dimensionName);
            const queryResult = await this.DatabaseService.executeQuery(queryStr.query, queryStr.values);
            if (queryResult.length === 1) {
                const isValidSchema = await this.service.ajvValidator(queryResult[0].dimension_data.input, inputData);
                console.log(queryResult[0].dimension_data.input);
                console.log("Input data",inputData);
                if (!isValidSchema['message']) {
                    await this.service.writeToCSVFile(dimensionName, [inputData.dimension]);
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

    @Post('event')
    async createEvent(@Body() inputData) {

        try {
            
            const eventName = inputData.event_name;
            const queryStr = await IngestionDatasetQuary.getEvents(eventName);
            const queryResult = await this.DatabaseService.executeQuery(queryStr.query, queryStr.values);
            if (queryResult.length === 1) {
                const isValidSchema = await this.service.ajvValidator(queryResult[0].event_data.input, inputData);
                console.log(queryResult[0].event_data.input);
                if (!isValidSchema['errors']) {
                    await this.service.writeToCSVFile(eventName, [inputData.event]);
                    return {
                        message: "Event Added Successfully"
                    }
                } else {
                    return isValidSchema
                }
            } else {
                return {
                    message: "No Event Found"
                }
            }
        } catch (e) {
            console.error('create-event-impl.executeQueryAndReturnResults: ', e.message);
            throw new Error(e);
        }
    }

    @Post('pipeline')
    async createPipe(){
        return 'ok'
    }

}
