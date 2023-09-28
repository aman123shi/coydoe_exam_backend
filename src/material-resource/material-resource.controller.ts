import { ExpressRequest } from '@app/user/types/expressRequest.interface';
import {
  Body,
  Controller,
  Delete,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CreateMaterialResourceDto } from './dto/createMaterialResource.dto';
import { MaterialResourceService } from './material-resource.service';
import { UpdateMaterialResourceDto } from './dto/updateMaterialResource.dto';
import mongoose from 'mongoose';
import { GetMaterialResourceDto } from './dto/getMaterialResource.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('material-resources')
export class MaterialResourceController {
  constructor(private materialResourceService: MaterialResourceService) {}

  @Post('get')
  async getMaterialResource(
    @Body() getMaterialResource: GetMaterialResourceDto,
  ) {
    return await this.materialResourceService.getMaterialResource(
      getMaterialResource,
    );
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'pdfDocument', maxCount: 1 }]),
  )
  async createMaterialResource(
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: false,
      }),
    )
    files: {
      pdfDocument?: Express.Multer.File[] | undefined;
    },
    @Body() createMaterialResourceDto: CreateMaterialResourceDto,
    @Req() req: ExpressRequest,
  ) {
    const documentUrl = files?.pdfDocument
      ? files?.pdfDocument[0].filename
      : null;

    return await this.materialResourceService.createMaterialResource(
      createMaterialResourceDto,
      documentUrl,
      req.userId,
    );
  }

  @Put('/:id')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'pdfDocument', maxCount: 1 }]),
  )
  async updateMaterialResource(
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: false,
      }),
    )
    files: {
      pdfDocument?: Express.Multer.File[] | undefined;
    },
    @Body() updateMaterialResourceDto: UpdateMaterialResourceDto,
    @Param('id') materialResourceId: mongoose.Schema.Types.ObjectId,
  ) {
    const documentUrl = files?.pdfDocument
      ? files?.pdfDocument[0].filename
      : null;

    return await this.materialResourceService.updateMaterialResource(
      updateMaterialResourceDto,
      documentUrl,
      materialResourceId,
    );
  }

  @Delete('/:id')
  async deleteMaterialResource(
    @Param('id') materialResourceId: mongoose.Schema.Types.ObjectId,
  ) {
    console.log(materialResourceId);

    return await this.materialResourceService.deleteMaterialResource(
      materialResourceId,
    );
  }
}
