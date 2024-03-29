import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ExamCategoryService } from '@app/exam-category/exam-category.service';
import { CreateCourseDto } from '@app/course/dtos/createCourse.dto';
import { UpdateCourseDto } from '@app/course/dtos/updateCourse.dto';
import { SubExamCategoryService } from '@app/sub-exam-category/sub-exam-category.service';
import { InjectModel } from '@nestjs/mongoose';
import { Course, CourseDocument } from './schemas/course.schema';
import mongoose, { Model } from 'mongoose';
import {
  CourseSubExamCategory,
  CourseSubExamCategoryDocument,
} from './schemas/courseSubExamCategory.schema';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(CourseSubExamCategory.name)
    private courseSubExamCategoryModel: Model<CourseSubExamCategoryDocument>,
    @Inject(forwardRef(() => ExamCategoryService))
    private readonly examCategoryService: ExamCategoryService,
    private readonly subExamCategoryService: SubExamCategoryService,
  ) {}

  // get all courses under specified exam-categories with optional query
  async getCourses(
    examCategoryId: mongoose.Schema.Types.ObjectId,
    query: string | any,
  ): Promise<Course[]> {
    const matchCriteria: any = { examCategory: examCategoryId };
    //if query parameter is provided filter courses by if they have grouped or ungrouped question
    if (query) {
      if (query == 'grouped') matchCriteria.hasDirections = true;
      else matchCriteria.hasDirections = false;
    }
    return await this.courseModel.find(matchCriteria);
  }

  async getAllCourses(query: string | any): Promise<Course[]> {
    const matchCriteria: any = {};
    if (query) {
      if (query == 'grouped') matchCriteria.hasDirections = true;
      else matchCriteria.hasDirections = false;
    }
    return await this.courseModel.find(matchCriteria);
  }

  async getCourseById(
    id: mongoose.Schema.Types.ObjectId | mongoose.Types.ObjectId,
  ): Promise<Course> {
    return await this.courseModel.findOne({ _id: id });
  }

  async createCourse(createCourseDto: CreateCourseDto) {
    const newCourse = new this.courseModel();
    Object.assign(newCourse, createCourseDto);
    const examCategory = await this.examCategoryService.getExamCategoryById(
      createCourseDto.examCategory,
    );
    if (!examCategory) {
      throw new HttpException('Invalid ExamCategory', HttpStatus.BAD_REQUEST);
    }
    return await newCourse.save();
  }

  async updateCourse(
    id: mongoose.Schema.Types.ObjectId,
    updateCourseDto: UpdateCourseDto,
  ): Promise<any> {
    //:TODO if exam-category will be  updated check it's existence before update
    try {
      return await this.courseModel.updateOne({ _id: id }, updateCourseDto, {
        new: true,
      });
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async getSubExamCategories(id: mongoose.Schema.Types.ObjectId) {
    const subExamCategories = await this.courseSubExamCategoryModel
      .find({ course: id })
      .select('subExamCategory');
    const ids = subExamCategories.map((sub) => sub.subExamCategory);
    console.log(ids);
    return await this.subExamCategoryService.getSubExamCategoriesById(ids);
  }
  async deleteCourse(id: mongoose.Schema.Types.ObjectId): Promise<any> {
    return await this.courseModel.deleteOne({ _id: id });
  }
}
