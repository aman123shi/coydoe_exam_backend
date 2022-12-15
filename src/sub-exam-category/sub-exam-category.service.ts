import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { SubExamCategoryDto } from '@app/sub-exam-category/dto/sub-exam-category.dto';
import { SubExamCategoryEntity } from '@app/sub-exam-category/sub-exam-category.entity';

@Injectable()
export class SubExamCategoryService {
  constructor(
    @InjectRepository(SubExamCategoryEntity)
    private readonly subExamCategoryRepository: Repository<SubExamCategoryEntity>,
  ) {}

  async getSubExamCategory(): Promise<SubExamCategoryEntity[]> {
    return await this.subExamCategoryRepository.find();
  }
  async getSubExamCategoriesById(
    ids: number[],
  ): Promise<SubExamCategoryEntity[]> {
    return await this.subExamCategoryRepository.find({
      where: [{ id: In(ids) }],
    });
  }
  async createSubExamCategory(
    subExamCategoryDto: SubExamCategoryDto,
  ): Promise<SubExamCategoryEntity> {
    let newExamCategory = new SubExamCategoryEntity();
    Object.assign(newExamCategory, subExamCategoryDto);
    return await this.subExamCategoryRepository.save(newExamCategory);
  }

  async updateSubExamCategory(
    id: number,
    subExamCategoryDto: SubExamCategoryDto,
  ) {
    return await this.subExamCategoryRepository.update(
      { id: id },
      subExamCategoryDto,
    );
  }

  async deleteSubExamCategory(id: number) {
    return await this.subExamCategoryRepository.delete({ id: id });
  }
}
