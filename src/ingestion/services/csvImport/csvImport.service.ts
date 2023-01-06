import {Injectable} from "@nestjs/common";
import {HttpCustomService} from "../HttpCustomService";
import {Express} from 'express';
import {Result} from "../../interfaces/Ingestion-data";
import {GenericFunction} from "../generic-function";
import {ReadStream} from "fs";

const fs = require('fs');
const {parse} = require('@fast-csv/parse');

let csvImportSchema = {
    "type": "object",
    "properties": {
        "ingestion_type": {
            "type": "string",
            "enum": [
                "event",
                "dataset",
                "dimension"
            ]
        },
        "ingestion_name": {
            "type": "string",
            "shouldNotNull": true
        }
    },
    "required": [
        "ingestion_type",
        "ingestion_name"
    ]
};

interface CSVInputBodyInterface {
    ingestion_type: string;
    ingestion_name: string;
}

@Injectable()
export class CsvImportService {
    constructor(private http: HttpCustomService, private service: GenericFunction) {
    }

    async readAndParseFile(inputBody: CSVInputBodyInterface, file: Express.Multer.File): Promise<Result> {
        return new Promise(async (resolve, reject) => {
            const isValidSchema: any = await this.service.ajvValidator(csvImportSchema, inputBody);
            if (isValidSchema.errors) {
                reject({code: 400, error: isValidSchema.errors});
            } else {
                const ingestionType = inputBody.ingestion_type, ingestionName = inputBody.ingestion_name;

                const batchLimit: number = 1000;
                let batchCounter: number = 0,
                    ingestionTypeBodyArray: any = [];
                const csvReadStream = fs.createReadStream(file.path)
                    .pipe(parse({headers: true}))
                    .on('data', (csvrow) => {

                        let numberChecking: number;
                        for (let key in csvrow) {
                            numberChecking = Number(csvrow[key]);
                            if (!isNaN(numberChecking)) {
                                csvrow[key] = numberChecking;
                            }
                        }
                        batchCounter++;
                        ingestionTypeBodyArray.push({...csvrow});
                        if (batchCounter > batchLimit) {
                            batchCounter = 0;
                            csvReadStream.pause();
                            this.resetAndMakeAPICall(ingestionType, ingestionName, ingestionTypeBodyArray, csvReadStream);
                            ingestionTypeBodyArray = []
                        }
                    })
                    .on('error', (err) => {
                        console.error('Steam error -> : ', err);
                        reject({code: 400, error: err.message});

                    })
                    .on('end', async () => {
                        // flush the remaining csv data to API
                        if (ingestionTypeBodyArray.length > 0) {
                            batchCounter = 0;
                            this.resetAndMakeAPICall(ingestionType, ingestionName, ingestionTypeBodyArray, csvReadStream);
                            ingestionTypeBodyArray = []
                        }
                        // delete the file
                        try {
                            fs.unlinkSync(`./files/${file.originalname}`);
                            resolve({code: 200, message: 'CSV Uploaded Successfully'});
                        } catch (delErr) {
                            console.error('routes.: unable to delete file ', delErr);
                            resolve({code: 200, message: 'CSV Upload done but unable to delete'});
                        }
                    });
            }
        });
    }

    /**
     * Rest the body array and make the api call
     * @param {string} ingestionType input from api body
     * @param {string} ingestionName input from api body
     * @param {any[]} ingestionTypeBodyArray pass by reference from parent
     * @param reject pass by the parent since to avoid another try catch block, convert to promise if required and confusing
     * @returns {Promise<void>}
     */
    async resetAndMakeAPICall(ingestionType: string, ingestionName: string, ingestionTypeBodyArray: any[],
                              csvReadStream: ReadStream) {
        let postBody: any = {};
        const url: string = process.env.URL + `/ingestion/${ingestionType}`;
        const mainKey = ingestionType + '_name';
        postBody[mainKey] = ingestionName;
        postBody[ingestionType] = [...ingestionTypeBodyArray];
        try {
            await this.http.post(url, postBody);
            csvReadStream.resume();
        } catch (apiErr) {
            csvReadStream.destroy(apiErr.response?.data || apiErr.message);
            return;
        }
    }
}