import { ExpressRequest } from '@app/user/types/expressRequest.interface';
import {
  Body,
  Controller,
  Get,
  ParseFilePipe,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { SubmitInnovationDto } from './dtos/submitInnovation.dto';
import { InnovationService } from './innovation.service';

@Controller('innovations')
export class InnovationController {
  constructor(private readonly innovationService: InnovationService) {}

  @Get()
  async getMaterialResource() {
    return await this.innovationService.getInnovationReport();
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'pdfDocument', maxCount: 1 }]),
  )
  async submitInnovation(
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: false,
      }),
    )
    files: {
      pdfDocument?: Express.Multer.File[] | undefined;
    },
    @Body() submitInnovationDto: SubmitInnovationDto,
    @Req() req: ExpressRequest,
  ) {
    const documentUrl = files?.pdfDocument
      ? files?.pdfDocument[0].filename
      : null;

    return await this.innovationService.createInnovationReport(
      submitInnovationDto,
      documentUrl,
    );
  }
}
