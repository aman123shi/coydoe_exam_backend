import { CourseService } from '@app/course/course.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamCategoryDto } from './dto/exam-category.dto';
import { ExamCategoryEntity } from './exam-category.entity';

@Injectable()
export class ExamCategoryService {
  constructor(
    @InjectRepository(ExamCategoryEntity)
    private readonly examCategoryRepository: Repository<ExamCategoryEntity>,
    @Inject(forwardRef(() => CourseService))
    private readonly courseService: CourseService,
  ) {}

  async getExamCategory(): Promise<ExamCategoryEntity[]> {
    return await this.examCategoryRepository.find();
  }
  async getExamCategoriesWithCourses() {
    let examCategories = await this.examCategoryRepository.find();
    let response = [];
    for (const examCat of examCategories) {
      let courses = await this.courseService.getCourses(examCat.id);
      let examCategoryWithCourses = {
        id: examCat.id,
        name: examCat.name,
        courses,
      };
      response.push(examCategoryWithCourses);
    }
    return response;
  }
  async getExamCategoryById(id: number): Promise<ExamCategoryEntity> {
    return await this.examCategoryRepository.findOne({ where: [{ id: id }] });
  }
  async createExamCategory(
    examCategoryDto: ExamCategoryDto,
  ): Promise<ExamCategoryEntity> {
    let newExamCategory = new ExamCategoryEntity();
    Object.assign(newExamCategory, examCategoryDto);
    return await this.examCategoryRepository.save(newExamCategory);
  }

  async updateExamCategory(id: number, examCategoryDto: ExamCategoryDto) {
    return await this.examCategoryRepository.update(
      { id: id },
      examCategoryDto,
    );
  }

  async deleteExamCategory(id: number) {
    return await this.examCategoryRepository.delete({ id: id });
  }
}
