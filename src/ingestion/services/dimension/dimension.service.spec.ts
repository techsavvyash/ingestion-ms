import {Test, TestingModule} from '@nestjs/testing';
import {DimensionService} from './dimension.service';
import {genricFunction} from '../gericFunction';
import {DatabaseService} from '../../../database/database.service';

describe('DimensionService', () => {
    let service: DimensionService;
    const data = {
        "input": {
            "type": "object",
            "required": [
                "dimension_name",
                "dimension"
            ],
            "properties": {
                "dimension": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "required": [
                            "school_id",
                            "school_name"
                        ],
                        "properties": {
                            "school_id": {
                                "type": "string"
                            },
                            "school_name": {
                                "type": "string"
                            }
                        }
                    }
                },
                "dimension_name": {
                    "type": "string"
                }
            }
        },
        "dimension_name": "dimension",
        "ingestion_type": "dimension"
    };

    const mockDatabaseService = {
        executeQuery: jest.fn().mockReturnValueOnce(0).mockReturnValueOnce([{dimension_data: data}])
            .mockReturnValueOnce([{dimension_data: data}])
            .mockReturnValueOnce([{dataset_data: data}])
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DatabaseService, DimensionService, genricFunction,
                {
                    provide: DatabaseService,
                    useValue: mockDatabaseService
                },
                {
                    provide: DimensionService,
                    useClass: DimensionService
                },
                {
                    provide: genricFunction,
                    useClass: genricFunction
                }],
        }).compile();
        service = module.get<DimensionService>(DimensionService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('No Dimension Found', async () => {
        const dimensionData = {
            "dimension_name": "district",
            "dimension": [{
                "name": "jhaha",
                "district_id": "SH123"
            }]
        };
        let resultOutput =
            {code: 400, error: "No dimension found"};
        expect(await service.createDimension(dimensionData)).toStrictEqual(resultOutput)
    });

    it('Validation Error', async () => {
        const dimensionData = {
            "dimension_name": "school",
            "dimension": [{
                "school_id": 6677
            }]
        };

        let resultOutput =
            {
                code: 400, error: [
                    {
                        "instancePath": "/dimension/0",
                        "schemaPath": "#/properties/dimension/items/required",
                        "keyword": "required",
                        "params": {
                            "missingProperty": "school_name"
                        },
                        "message": "must have required property 'school_name'"
                    }
                ]
            };

        expect(await service.createDimension(dimensionData)).toStrictEqual(resultOutput);

    });

    it('Dimension Added Successfully', async () => {
        const Datasetdto = {
            "dimension_name": "school",
            "dimension": [{
                "school_id": "6677",
                "school_name": "test"
            }]
        };

        let resultOutput =
            {code: 200, message: "Dimension added successfully"};

        expect(await service.createDimension(Datasetdto)).toStrictEqual(resultOutput);

    });

    it('Dimension Name is Missing', async () => {
        const Datasetdto = {
            "dimension_name": "",
            "dimension": [{
                "school_id": "6677",
                "school_name": "test"
            }]
        };

        let resultOutput =
            {code: 400, error: "Dimension name is missing"};

        expect(await service.createDimension(Datasetdto)).toStrictEqual(resultOutput);

    });
});
