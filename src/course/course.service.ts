import {
  HttpException,
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CourseEntity } from '@app/course/course.entity';
import { ExamCategoryService } from '@app/exam-category/exam-category.service';
import { CreateCourseDto } from '@app/course/dtos/createCourse.dto';
import { UpdateCourseDto } from '@app/course/dtos/updateCourse.dto';
import { BadEntityException } from '@app/exception-handlers/bad-request.exception';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    private readonly examCategoryService: ExamCategoryService,
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

  async deleteCourse(id: number): Promise<DeleteResult> {
    return await this.courseRepository.delete({ id: id });
  }
}
