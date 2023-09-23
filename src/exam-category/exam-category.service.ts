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
    const examCategories = await this.examCategoryModel.find();
    const response = [];
    for (const examCat of examCategories) {
      const courses = await this.courseService.getCourses(examCat.id, null);
      const examCategoryWithCourses = {
        _id: examCat.id,
        name: examCat.name,
        courses,
        category: examCat?.category,
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
    const newExamCategory = new this.examCategoryModel();
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
