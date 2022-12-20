import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import  { genericTestImpl } from '.././utils/testing'

describe('IngestionService', () => {
  let service: IngestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IngestionService],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
