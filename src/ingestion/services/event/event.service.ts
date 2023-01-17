import {Injectable} from '@nestjs/common';
import {IngestionDatasetQuery} from '../../query/ingestionQuery';
import {DatabaseService} from '../../../database/database.service';
import {GenericFunction} from '../generic-function';
import {IEvent} from '../../interfaces/Ingestion-data'

@Injectable()
export class EventService {
    constructor(private DatabaseService: DatabaseService, private service: GenericFunction) {
    }

    async createEvent(inputData: IEvent) {
        try {
            if (inputData.event_name) {
                const eventName = inputData.event_name;
                const queryStr = await IngestionDatasetQuery.getEvents(eventName);
                const queryResult = await this.DatabaseService.executeQuery(queryStr.query, queryStr.values);
                if (queryResult?.length === 1) {
                    let errorCounter = 0, validCounter = 0;
                    let validArray = [], invalidArray = [];
                    for (let record of inputData.event) {
                        const isValidSchema: any = await this.service.ajvValidator(queryResult[0].event_data.input.properties.event.items, record);
                        if (isValidSchema.errors) {
                            record['description'] = isValidSchema.errors;
                            invalidArray.push(record);
                            // await this.service.writeToCSVFile(eventName + '_event_errors', [record]);
                            errorCounter = errorCounter + 1;
                        } else {
                            // await this.service.writeToCSVFile(eventName + '_event', [record]);
                            validArray.push(record);
                            validCounter = validCounter + 1;
                        }
                    }
                    await this.service.writeToCSVFile(eventName + '_event_errors', invalidArray);
                    await this.service.writeToCSVFile(eventName + '_event', validArray);
                    invalidArray = undefined;
                    validArray = undefined;
                    return {
                        code: 200,
                        message: "Event added successfully",
                        errorCounter: errorCounter,
                        validCounter: validCounter
                    }
                } else {
                    return {
                        code: 400,
                        error: "No event found"
                    }
                }
            } else {
                return {
                    code: 400,
                    error: "Event name is missing"
                }
            }
        } catch (e) {
            console.error('create-event-impl.executeQueryAndReturnResults: ', e.message);
            throw new Error(e);
        }
    }
}
