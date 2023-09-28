import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  MaterialResource,
  MaterialResourceDocument,
} from './schemas/material-resource.schema';
import mongoose, { Model } from 'mongoose';
import { CreateMaterialResourceDto } from './dto/createMaterialResource.dto';
import { DataClerkService } from '@app/dataClerk/dataClerk.service';
import { AdminService } from '@app/admin/admin.service';
import { UpdateMaterialResourceDto } from './dto/updateMaterialResource.dto';
import { GetMaterialResourceDto } from './dto/getMaterialResource.dto';

@Injectable({})
export class MaterialResourceService {
  constructor(
    @InjectModel(MaterialResource.name)
    private materialResourceModel: Model<MaterialResourceDocument>,

    private readonly dataClerkService: DataClerkService,
    private readonly adminService: AdminService,
  ) {}

  async getMaterialResource(getMaterialResourceDto: GetMaterialResourceDto) {
    const newMaterialResources = await this.materialResourceModel.find(
      getMaterialResourceDto,
    );

    return newMaterialResources;
  }

  async createMaterialResource(
    createMaterialResourceDto: CreateMaterialResourceDto,
    documentUrl: string | null,
    userId: mongoose.Schema.Types.ObjectId | undefined,
  ) {
    const newMaterialResource = new this.materialResourceModel();
    Object.assign(newMaterialResource, createMaterialResourceDto);

    if (documentUrl) newMaterialResource.url = documentUrl;

    const materialResource = await newMaterialResource.save();

    //increment EnteredQuestion for that clerk
    await this.dataClerkService.incrementQuestionEntered(userId);
    //insert data entry report for that day from dataClerkService(insert report)

    await this.dataClerkService.insertReport({
      clerkId: userId,
      courseId: createMaterialResourceDto.courseId,
    });

    //increment admin notification for that user AdminService
    await this.adminService.incrementDataInsertionNotification(userId);
    return materialResource;
  }

  async updateMaterialResource(
    updateMaterialResourceDto: UpdateMaterialResourceDto,
    documentUrl: string | null,
    materialResourceId: mongoose.Schema.Types.ObjectId,
  ) {
    if (documentUrl) updateMaterialResourceDto.url = documentUrl;
    const newMaterialResource =
      await this.materialResourceModel.findByIdAndUpdate(
        materialResourceId,
        updateMaterialResourceDto,
        { new: true },
      );

    return newMaterialResource;
  }

  async deleteMaterialResource(
    materialResourceId: mongoose.Schema.Types.ObjectId,
  ) {
    const newMaterialResource =
      await this.materialResourceModel.findByIdAndRemove(materialResourceId);

    return newMaterialResource;
  }
}
