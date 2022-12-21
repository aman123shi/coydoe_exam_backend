import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreatePageDto } from './dto/createPage.dto';
import { Page, PageDocument } from './schemas/page.schema';

@Injectable()
export class PagesService {
  constructor(
    @InjectModel(Page.name) private pagesModel: Model<PageDocument>,
  ) {}

  async createNewPage(createPageDto: CreatePageDto) {
    let newPage = new this.pagesModel();
    Object.assign(newPage, createPageDto);
    return await newPage.save();
  }

  async findPage({
    courseId,
    year,
    userId,
    page,
  }: {
    courseId: mongoose.Schema.Types.ObjectId;
    year: number;
    userId: mongoose.Schema.Types.ObjectId;
    page: number;
  }) {
    return await this.pagesModel.findOne({ courseId, year, userId, page });
  }

  async updatePage(createPageDto: CreatePageDto) {}
}
