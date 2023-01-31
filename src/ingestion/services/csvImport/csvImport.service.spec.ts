import { Test, TestingModule } from '@nestjs/testing';
import { GenericFunction } from '../generic-function';
import { CsvImportService } from './csvImport.service';
import { HttpCustomService } from "../HttpCustomService";
import * as fs from 'fs';
import { DatabaseService } from '../../../database/database.service';
import { Readable } from 'stream';


const mockFilePath = './files/list.csv';

describe('csvImportService', () => {
    let service: CsvImportService;

    const mockHttpservice = {
        post: jest.fn()
    };
    const mockDatabaseService = {
        executeQuery: jest.fn().mockReturnValueOnce([]).mockReturnValueOnce([{ pid: 1 }])
    }

    const file: Express.Multer.File = {
        originalname: 'file.csv',
        mimetype: 'text/csv',
        path: 'something',
        buffer: Buffer.from('one,two,three'),
        fieldname: '',
        encoding: '',
        size: 0,
        stream: new Readable,
        destination: '',
        filename: ''
    };
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [HttpCustomService, GenericFunction, CsvImportService, DatabaseService,
                {
                    provide: HttpCustomService,
                    useValue: mockHttpservice
                },
                {
                    provide: GenericFunction,
                    useClass: GenericFunction
                },
                {
                    provide: DatabaseService,
                    useValue: mockDatabaseService
                },
                {
                    provide: CsvImportService,
                    useClass: CsvImportService
                }],
        }).compile();
        service = module.get<CsvImportService>(CsvImportService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('Validation Error', async () => {
        const inputData = {
            "ingestion_type": "test",
            "ingestion_name": "student_attendance"
        };
        let resultOutput = {
            code: 400,
            error: [
                {
                    instancePath: '/ingestion_type',
                    schemaPath: '#/properties/ingestion_type/enum',
                    keyword: 'enum',
                    params: {
                        allowedValues: [
                            "event",
                            "dataset",
                            "dimension"
                        ]
                    },
                    message: 'must be equal to one of the allowed values'
                }
            ]
        };
        try {
            await service.readAndParseFile(inputData, file);
        } catch (e) {
            expect(e).toEqual(resultOutput);
        }
    });

    it('File is not Tracked', async () => {
        const filePath = createNumberOfLineCSVFile(['school_id', 'grade', 'count'], 1003, 'list_valid_large.csv');

        const inputData = {
            "ingestion_type": "event",
            "ingestion_name": "student_attendance"
        };
        let resultOutput = { "code": 400, "error": "File is not Tracked" };
        expect(await service.readAndParseFile(inputData, file)).toStrictEqual(resultOutput);
    });

    it('File is being processed', async () => {

        const filePath = createNumberOfLineCSVFile(['school_id', 'grade', 'count'], 1003, 'file.csv');
        let file1: Express.Multer.File = {
            originalname: 'file.csv',
            mimetype: 'text/csv',
            path: filePath,
            buffer: Buffer.from('one,two,three'),
            fieldname: '',
            encoding: '',
            size: 0,
            stream: new Readable,
            destination: '',
            filename: ''
        };
        const inputData = {
            "ingestion_type": "event",
            "ingestion_name": "student_attendance"
        };

        let resultOutput = { code: 200, message: 'File is being processed' };
        expect(await service.readAndParseFile(inputData, file1)).toStrictEqual(resultOutput);
    });

    it('CSV Uploaded Successfully', async () => {

        const filePath = createNumberOfLineCSVFile(['school_id', 'grade', 'count'], 1003, 'file1.csv');
        let file1: Express.Multer.File = {
            originalname: 'file1.csv',
            mimetype: 'text/csv',
            path: filePath,
            buffer: Buffer.from('one,two,three'),
            fieldname: '',
            encoding: '',
            size: 0,
            stream: new Readable,
            destination: '',
            filename: ''
        };
        const inputData = {
            "ingestion_type": "event",
            "ingestion_name": "student_attendance"
        };

        let resultOutput = { code: 200, "message": "CSV Uploaded Successfully" };
        expect(await service.asyncProcessing(inputData, file1.path, 1)).toStrictEqual(resultOutput);
    });

        // test('it should make a successful API call and resume the stream', async () => {

        //     const mockHttp = {
        //         post: jest.fn().mockResolvedValue(true)
        //     };
        //     const mockCsvReadStream = {
        //         resume: jest.fn(),
        //         destroy: jest.fn()
        //     };
        //     const module: TestingModule = await Test.createTestingModule({
        //         providers: [HttpCustomService, GenericFunction, CsvImportService, DatabaseService,
        //             {
        //                 provide: HttpCustomService,
        //                 useValue: mockHttp
        //             },
        //             {
        //                 provide: GenericFunction,
        //                 useClass: GenericFunction
        //             },
        //             {
        //                 provide: DatabaseService,
        //                 useValue: mockDatabaseService
        //             },
        //             {
        //                 provide: CsvImportService,
        //                 useClass: CsvImportService
        //             }],
        //     }).compile();
        //     let ingestionTypeBodyArray = []
        //     service = module.get<CsvImportService>(CsvImportService);
        //     await service.resetAndMakeAPICall('dataset', 'ingestionName', [], );
        //     expect(mockHttp.post).toHaveBeenCalled();
        //     expect(mockCsvReadStream.resume).toHaveBeenCalled();
        //     expect(mockCsvReadStream.destroy).not.toHaveBeenCalled();
        // });

        // it('it should make an unsuccessful API call and throw an error', async () => {

        //     const mockHttp = {
        //         post: jest.fn().mockRejectedValue({ response: { data: 'API error' } })
        //     };
        //     const filePath1 = createNumberOfLineCSVFile(['school_id', 'grade', 'count'], 1003, 'file.csv');
        //     let file1: Express.Multer.File = {
        //         originalname: 'file.csv',
        //         mimetype: 'text/csv',
        //         path: filePath1,
        //         buffer: Buffer.from('one,two,three'),
        //         fieldname: '',
        //         encoding: '',
        //         size: 0,
        //         stream: new Readable,
        //         destination: '',
        //         filename: ''
                
        //     };
        //     const module: TestingModule = await Test.createTestingModule({
        //         providers: [HttpCustomService, GenericFunction, CsvImportService, DatabaseService,
        //             {
        //                 provide: HttpCustomService,
        //                 useValue: mockHttp
        //             },
        //             {
        //                 provide: GenericFunction,
        //                 useClass: GenericFunction
        //             },
        //             {
        //                 provide: DatabaseService,
        //                 useValue: mockDatabaseService
        //             },
        //             {
        //                 provide: CsvImportService,
        //                 useClass: CsvImportService
        //             }],
        //     }).compile();
        //     let ingestionTypeBodyArray = []
        //     service = module.get<CsvImportService>(CsvImportService);
        //     await expect(service.resetAndMakeAPICall('dataset', 'ingestionName', [] , file1,true)).rejects.toThrowError('"API error"');
        // });



});

async function errorCSVTest(service, filePath) {
    const errorResponse = {
        response: {
            data: {
                "message": [
                    {
                        "instancePath": "/event/0",
                        "schemaPath": "#/properties/event/items/required",
                        "keyword": "required",
                        "params": {
                            "missingProperty": "date"
                        },
                        "message": "must have required property 'date'"
                    }
                ]
            }
        }
    };
    const mockHttpservice = {
        post: jest.fn().mockImplementation(() => {
            throw errorResponse;
        })
    };
    const localModule: TestingModule = await Test.createTestingModule({
        providers: [HttpCustomService, GenericFunction, CsvImportService,
            {
                provide: HttpCustomService,
                useValue: mockHttpservice
            },
            {
                provide: GenericFunction,
                useClass: GenericFunction
            },
            {
                provide: CsvImportService,
                useClass: CsvImportService
            }],
    }).compile();
    service = localModule.get<CsvImportService>(CsvImportService);

    const inputData = {
        "ingestion_type": "event",
        "ingestion_name": "student_attendance"
    };
    let resultOutput = { code: 400, error: errorResponse.response.data.message };
    try {
        // promise reject is an error to be catched
        await service.readAndParseFile(inputData, filePath);
    } catch (someErr) {
        expect(someErr).toStrictEqual(resultOutput);
    }
}

// dynamically create csv file on specified number of line
function createNumberOfLineCSVFile(columns, csvNumberOfLine, fileName) {
    let csvFileData = columns.join(',') + '\n';
    const columnLength = columns.length;
    let individualLine = [];
    for (let i = 0; i < csvNumberOfLine; i++) {
        individualLine = [];
        for (let j = 1; j <= columnLength; j++) {
            individualLine.push((i + j).toString());
        }
        csvFileData += `${individualLine.join(',')}\n`
    }
    const dirName = './files/';
    createFile(dirName, fileName, csvFileData);
    return dirName + fileName;
}

const createFile = (
    path: string,
    fileName: string,
    data: string,
): void => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
    fs.writeFileSync(`${path}/${fileName}`, data, 'utf8');

};

