import { Injectable } from '@nestjs/common';
import { SubExamCategoryDto } from '@app/sub-exam-category/dto/sub-exam-category.dto';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  SubExamCategory,
  SubExamCategoryDocument,
} from './schemas/subExamCategory.schema';

@Injectable()
export class SubExamCategoryService {
  constructor(
    @InjectModel(SubExamCategory.name)
    private subExamCategoryModel: Model<SubExamCategoryDocument>,
  ) {}

  async getSubExamCategory(): Promise<SubExamCategory[]> {
    return await this.subExamCategoryModel.find();
  }

  async getSubExamCategoryByCategoryId(
    id: mongoose.Schema.Types.ObjectId,
  ): Promise<SubExamCategory[]> {
    return await this.subExamCategoryModel.find({ examCategory: id });
  }

  async getSubExamCategoriesById(
    ids: mongoose.Schema.Types.ObjectId[],
  ): Promise<SubExamCategory[]> {
    return await this.subExamCategoryModel.find({ _id: { $in: ids } });
  }

  async createSubExamCategory(
    subExamCategoryDto: SubExamCategoryDto,
  ): Promise<SubExamCategory> {
    let newExamCategory = new this.subExamCategoryModel();
    Object.assign(newExamCategory, subExamCategoryDto);
    return await newExamCategory.save();
  }

  async updateSubExamCategory(
    id: mongoose.Schema.Types.ObjectId,
    subExamCategoryDto: SubExamCategoryDto,
  ): Promise<any> {
    return await this.subExamCategoryModel.updateOne(
      { _id: id },
      subExamCategoryDto,
    );
  }

  async deleteSubExamCategory(
    id: mongoose.Schema.Types.ObjectId,
  ): Promise<any> {
    return await this.subExamCategoryModel.deleteOne({ _id: id });
  }
}
