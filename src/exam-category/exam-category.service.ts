import { CourseService } from '@app/course/course.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ExamCategoryDto } from './dto/exam-category.dto';
import {
  ExamCategory,
  ExamCategoryDocument,
} from './schemas/examCategory.schema';

@Injectable()
export class ExamCategoryService {
  constructor(
    @InjectModel(ExamCategory.name)
    private examCategoryModel: Model<ExamCategoryDocument>,
    @Inject(forwardRef(() => CourseService))
    private readonly courseService: CourseService,
  ) {}

  async getExamCategory(): Promise<ExamCategory[]> {
    return await this.examCategoryModel.find();
  }
  async getExamCategoriesWithCourses() {
    let examCategories = await this.examCategoryModel.find();
    let response = [];
    for (const examCat of examCategories) {
      let courses = await this.courseService.getCourses(examCat.id);
      let examCategoryWithCourses = {
        _id: examCat.id,
        name: examCat.name,
        courses,
      };
      response.push(examCategoryWithCourses);
    }
    return response;
  }
  async getExamCategoryById(
    id: mongoose.Schema.Types.ObjectId,
  ): Promise<ExamCategory> {
    return await this.examCategoryModel.findOne({ id: id });
  }
  async createExamCategory(
    examCategoryDto: ExamCategoryDto,
  ): Promise<ExamCategory> {
    let newExamCategory = new this.examCategoryModel();
    Object.assign(newExamCategory, examCategoryDto);
    return await newExamCategory.save();
  }

  async updateExamCategory(
    id: mongoose.Schema.Types.ObjectId,
    examCategoryDto: ExamCategoryDto,
  ): Promise<any> {
    return await this.examCategoryModel.updateOne(
      { _id: id },
      examCategoryDto,
      { new: true },
    );
  }

  async deleteExamCategory(id: mongoose.Schema.Types.ObjectId): Promise<any> {
    return await this.examCategoryModel.deleteOne({ _id: id });
  }
}
