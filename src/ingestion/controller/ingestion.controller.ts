import {Dataset, Dimension, CSVBody, FileStatus, IEvent, Pipeline} from '../interfaces/Ingestion-data';
import {
    Body,
    Controller, FileTypeValidator,
    Get,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    Query,
    Res,
    UploadedFile,
    UseInterceptors,
    Put
} from '@nestjs/common';
import {DatasetService} from '../services/dataset/dataset.service';
import {DimensionService} from '../services/dimension/dimension.service';
import {EventService} from '../services/event/event.service';
import {PipelineService} from '../services/pipeline/pipeline.service';
import {Response} from 'express';
import {CsvImportService} from "../services/csvImport/csvImport.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {FileIsDefinedValidator} from "../validators/file-is-defined-validator";
import {FileStatusService} from '../services/file-status/file-status.service';
import {UpdateFileStatusService} from '../services/update-file-status/update-file-status.service';
import {ApiBody, ApiConsumes, ApiProperty, ApiTags} from '@nestjs/swagger';

interface CSVBodyInterface {
    ingestion_type: string;
    ingestion_name: string;
}

interface FileStatusInterface {
    file_name: string;
    ingestion_type: string;
    ingestion_name: string;
    status: string;
}

@ApiTags('ingestion')
@Controller('ingestion')
export class IngestionController {
    constructor(
        private datasetservice: DatasetService, private dimesionService: DimensionService
        , private eventService: EventService, private pipelineService: PipelineService, private csvImportService: CsvImportService
        , private filestatus: FileStatusService, private updateFileStatus: UpdateFileStatusService) {
    }

    @Post('/dataset')
    async createDataset(@Body() inputData: Dataset, @Res()response: Response) {
        try {
            let result = await this.datasetservice.createDataset(inputData);
            if (result.code == 400) {
                response.status(400).send({"message": result.error});
            } else {
                response.status(200).send({"message": result.message});
            }
        }
        catch (e) {
            console.error('create-dataset-impl: ', e.message);
            throw new Error(e);
        }
    }

    @Post('/dimension')
    async createDimenshion(@Body() inputData: Dimension, @Res()response: Response) {
        try {
            let result = await this.dimesionService.createDimension(inputData);
            if (result.code == 400) {
                response.status(400).send({"message": result.error});
            } else {
                response.status(200).send({"message": result.message});
            }
        } catch (e) {
            console.error('create-dimension-impl: ', e.message);
            throw new Error(e);
        }
    }

    @Post('/event')
    async createEvent(@Body() inputData: IEvent, @Res()response: Response) {
        try {
            let result = await this.eventService.createEvent(inputData);
            if (result.code == 400) {
                response.status(400).send({"message": result.error});
            } else {
                response.status(200).send({"message": result.message});
            }
        } catch (e) {
            console.error('create-event-impl: ', e.message);
            throw new Error(e);
        }
    }

    @Post('/pipeline')
    async pipeline(@Body() pipelineData: Pipeline, @Res()response: Response) {
        try {
            let result = await this.pipelineService.pipeline(pipelineData);
            if (result.code == 400) {
                response.status(400).send({"message": result.error});
            } else {
                response.status(200).send({"message": result.message});
            }
        }
        catch (e) {
            console.error('create-pipeline-impl: ', e.message);
            throw new Error(e);
        }
    }

    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './files',
        })
    }))
    @Post('/csv')
    @ApiConsumes('multipart/form-data')
    async csv(@Body() body: CSVBodyInterface, @Res()response: Response, @UploadedFile(
        new ParseFilePipe({
            validators: [
                new FileIsDefinedValidator(),
                new FileTypeValidator({fileType: 'text/csv'}),
            ],
        }),
    ) file: Express.Multer.File) {
        try {
            let result = await this.csvImportService.readAndParseFile(body, file);
            if (result.code == 400) {
                response.status(400).send({message: result.error});
            } else {
                response.status(200).send({message: result.message});
            }
        } catch (e) {
            console.error('ingestion.controller.csv: ', e);
            response.status(400).send({message: e.error || e.message});
            // throw new Error(e);
        }
    }

    @Get('/file-status')
    async getFileStatus(@Query() query: FileStatus, @Res()response: Response) {
        try {
            let result: any = await this.filestatus.getFileStatus(query);
            if (result.code == 400) {
                response.status(400).send({"message": result.error});
            } else {
                response.status(200).send({"response": result.response});
            }
        }
        catch (e) {
            console.error('get-filestatus-impl: ', e.message);
            throw new Error(e);
        }
    }

    @Put('/file-status')
    async updateFileStatusService(@Body() inputData: FileStatusInterface, @Res()response: Response) {
        try {
            let result: any = await this.updateFileStatus.UpdateFileStatus(inputData);
            if (result.code == 400) {
                response.status(400).send({"message": result.error});
            } else {
                response.status(200).send({"message": result.message, "ready_to_archive": result.ready_to_archive});
            }
        }
        catch (e) {
            console.error('ingestion.controller.updateFileStatusService: ', e.message);
            throw new Error(e);
        }
    }
}
