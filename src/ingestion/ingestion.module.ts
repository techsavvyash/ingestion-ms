import { Module } from '@nestjs/common';
import { IngestionController } from './controller/ingestion.controller';
import { IngestionService } from './service/ingestion.service';

@Module({
  controllers: [IngestionController],
  providers: [IngestionService]
})
export class IngestionModule {}
