import {Injectable} from '@nestjs/common';
import Ajv from "ajv";

const ajv = new Ajv();
const ObjectsToCsv = require('objects-to-csv');

@Injectable()
export class genricFunction {

    // for handling locking and unlocking
    private currentlyLockedFiles: any = {};

    // creating a lock to wait
    async writeToCSVFile(fileName, inputArray) {
        try {
            do {
                // check is the lock is released
                if (this.currentlyLockedFiles[fileName]) {
                    await this.processSleep(10);
                } else {
                    // console.log('Lock released ');
                    break;
                }
            } while (true);
            // get the lock on the file
            this.currentlyLockedFiles[fileName] = true;
            const csv = new ObjectsToCsv(inputArray);
            let response = await csv.toDisk(`./${fileName}.csv`, {append: true});
            // delete the lock after writing
            delete this.currentlyLockedFiles[fileName];
            return response;
        } catch (e) {
            console.error('writeToCSVFile: ', e.message);
            throw new Error(e);
        }
    }

    async ajvValidator(schema, inputData) {
        const isValid = ajv.validate(schema, inputData);
        if (isValid) {
            return inputData;
        } else {
            return {
                errors: ajv.errors
            };
        }
    }

    async processSleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
}