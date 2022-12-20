import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import  { genericTestImpl } from '.././utils/testing'
import * as inputJson from '../utils/createDataset.json';
import { IngestionService } from '../services/ingestion.service';
import { DatabaseService } from '../../database/database.service';
describe('IngestionController', () => {
  let controller: IngestionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      
      controllers: [IngestionController],
      providers: [
        DatabaseService,
        ,
        
    ],
    }).compile();

    controller = module.get<IngestionController>(IngestionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

 

});


