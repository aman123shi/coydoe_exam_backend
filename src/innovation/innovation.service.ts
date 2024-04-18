import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Innovation, InnovationDocument } from './schema/innovation.schema';
import { Model } from 'mongoose';
import { SubmitInnovationDto } from './dtos/submitInnovation.dto';

@Injectable()
export class InnovationService {
  constructor(
    @InjectModel(Innovation.name)
    private innovationModel: Model<InnovationDocument>,
  ) {}

  async createInnovationReport(
    submitInnovationDto: SubmitInnovationDto,
    filePath: string | null,
  ) {
    const newInnovationSubmit = new this.innovationModel();
    Object.assign(newInnovationSubmit, submitInnovationDto);

    if (filePath) newInnovationSubmit.filePath = filePath;

    const innovationSubmitted = await newInnovationSubmit.save();

    return innovationSubmitted;
  }

  async getInnovationReport() {
    const newMaterialResources = await this.innovationModel.find();

    return { data: newMaterialResources };
  }
}
