import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CourseEntity } from '@app/course/course.entity';
import { ExamCategoryService } from '@app/exam-category/exam-category.service';
import { CreateCourseDto } from '@app/course/dtos/createCourse.dto';
import { UpdateCourseDto } from '@app/course/dtos/updateCourse.dto';
import { CourseSubExamCategoryEntity } from './courseSubExamCategory.entity';
import { SubExamCategoryService } from '@app/sub-exam-category/sub-exam-category.service';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(CourseSubExamCategoryEntity)
    private readonly courseSubExamRepository: Repository<CourseSubExamCategoryEntity>,
    @Inject(forwardRef(() => ExamCategoryService))
    private readonly examCategoryService: ExamCategoryService,

    private readonly subExamCategoryService: SubExamCategoryService,
  ) {}

  // get all courses under specified exam-categories
  async getCourses(examCategoryId: number): Promise<CourseEntity[]> {
    return await this.courseRepository.find({
      where: [
        {
          examCategory: examCategoryId,
        },
      ],
    });
  }

  async getCourseById(id: number): Promise<CourseEntity> {
    return await this.courseRepository.findOne({ where: [{ id: id }] });
  }

  async createCourse(createCourseDto: CreateCourseDto) {
    let newCourse = new CourseEntity();
    Object.assign(newCourse, createCourseDto);
    let examCategory = await this.examCategoryService.getExamCategoryById(
      createCourseDto.examCategory,
    );
    if (!examCategory) {
      throw new HttpException('Invalid ExamCategory', HttpStatus.BAD_REQUEST);
    }
    return await this.courseRepository.save(newCourse);
  }

  async updateCourse(id: number, updateCourseDto: UpdateCourseDto) {
    //:TODO if exam-category will be  updated check it's existence before update
    try {
      return await this.courseRepository.update({ id: id }, updateCourseDto);
    } catch (error) {
      console.log('error object logged  ' + JSON.stringify(error.message));
      return new UnprocessableEntityException(error);
    }
  }
  async getSubExamCategories(id: number) {
    let subExamCategories = await this.courseSubExamRepository.find({
      select: ['subExamCategory'],
      where: [{ course: id }],
    });
    let ids = subExamCategories.map((sub) => sub.subExamCategory);
    console.log(ids);
    return await this.subExamCategoryService.getSubExamCategoriesById(ids);
  }
  async deleteCourse(id: number): Promise<DeleteResult> {
    return await this.courseRepository.delete({ id: id });
  }
}
