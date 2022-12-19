import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePageDto } from './dto/createPage.dto';
import { PageEntity } from './page.entity';

@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(PageEntity)
    private readonly pagesRepository: Repository<PageEntity>,
  ) {}

  async createNewPage(createPageDto: CreatePageDto) {
    let newPage = new PageEntity();
    Object.assign(newPage, createPageDto);
    return await this.pagesRepository.save(newPage);
  }

  async findPage({
    courseId,
    year,
    userId,
    page,
  }: {
    courseId: number;
    year: number;
    userId: number;
    page: number;
  }) {
    return await this.pagesRepository.findOne({
      where: [{ courseId, year, userId, page }],
    });
  }

  async updatePage(createPageDto: CreatePageDto) {}
}
