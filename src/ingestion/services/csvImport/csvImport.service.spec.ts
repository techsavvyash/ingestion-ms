import {Test, TestingModule} from '@nestjs/testing';
import {GenericFunction} from '../generic-function';
import {CsvImportService} from './csvImport.service';
import {HttpCustomService} from "../HttpCustomService";
import * as fs from 'fs';
import {promisify} from 'util';


const mockFile = {
    fieldname: 'file',
    originalname: 'list.csv',
    encoding: '7bit',
    mimetype: 'text/csv',
    path: 'list.csv',
    buffer: Buffer.from('list.csv', 'utf8'),
    size: 51828,
} as Express.Multer.File;

describe('csvImportService', () => {
    let service: CsvImportService;

    const mockHttpservice = {
        post: jest.fn()
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
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
            await service.readAndParseFile(inputData, mockFile);
        } catch (e) {
            expect(e).toEqual(resultOutput);
        }
    });

    it('Valid Input', async () => {
        await createFile('./files/', 'list.csv', "school_id,grade,count\n1,2,3\n4,5,6");

        const mockFile = {
            fieldname: 'file',
            originalname: 'list.csv',
            encoding: '7bit',
            mimetype: 'text/csv',
            path: './files/list.csv',
            buffer: Buffer.from('list.csv', 'utf8'),
            size: 51828,
        } as Express.Multer.File;

        const inputData = {
            "ingestion_type": "event",
            "ingestion_name": "student_attendance"
        };
        let resultOutput = {code: 200, message: 'CSV Uploaded Successfully'};
        expect(await service.readAndParseFile(inputData, mockFile)).toStrictEqual(resultOutput);
    });
});

const checkIfFileOrDirectoryExists = (path: string): boolean => {
    return fs.existsSync(path);
};

const createFile = async (
    path: string,
    fileName: string,
    data: string,
): Promise<void> => {
    if (!checkIfFileOrDirectoryExists(path)) {
        fs.mkdirSync(path);
    }
    const writeFile = promisify(fs.writeFile);

    return await writeFile(`${path}/${fileName}`, data, 'utf8');
};