import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { DatasetService } from '../services/dataset/dataset.service';
import { DimensionService } from '../services/dimension/dimension.service';
import { EventService } from '../services/event/event.service';
import { PipelineService } from '../services/pipeline/pipeline.service';;
describe('IngestionController', () => {
  let controller: IngestionController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [DatasetService,
        DimensionService, EventService,PipelineService,
        {
          provide: DatasetService,
          useValue: {
            createDataset: jest.fn(dto =>{dto}),
          }
        },
        {
          provide: DimensionService,
          useValue: {
            createDimenshion:jest.fn(dto =>{dto}),
          }
        },
        {
          provide: EventService,
          useValue: {
            createEvent:jest.fn(dto =>{dto}),
          }
        },
        {
          provide: PipelineService,
          useValue: { pipeline:jest.fn(dto =>{dto})}
        }
      ],

    }).compile();

    controller = module.get<IngestionController>(IngestionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // it('should call an dataset api', async () => {
  //   const Datasetdto = {
  //     "dataset_name": "student_count_by_school_and_grade",
  //     "dataset": {
  //       "school_id": "6677",
  //       "grade": "t",
  //       "student_count": "07"
  //     }
  //   }
  //   expect(controller.createDataset(Datasetdto)).toBeCalled
  // })

  // it('should call an event api', () => {

  //   const eventData = {
  //     "event_name": "student_count",
  //     "event": {
  //       "school_id": "201",
  //       "grade": "1",
  //       "count": "10"
  //     }
  //   }
  //   expect(controller.createEvent(eventData)).toBeCalled
  // })

  // it('should call an dimension api', () => {
  //   const dimesionData = {
  //     "dimension_name": "district",
  //     "dimension": {
  //       "name": "jhaha",
  //       "district_id": "SH123"
  //     }
  //   }
  //   expect(controller.createDimenshion(dimesionData)).toBeCalled
  // })

  // it("should call an pipeline api", () => {
  //   const pipelinedata = {
  //     "pipeline_name": "student_count_pipe",
  //     "schedule_type": "dimension_to_db/ingest_to_aggregate/aggregate_to_dataset"
  //   }

  //   expect(controller.pipeline(pipelinedata)).toBeCalled 

  // })

});


