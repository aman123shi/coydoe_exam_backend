import { PagesService } from '@app/progress/pages.service';
import { ProgressService } from '@app/progress/progress.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGroupedQuestionDto } from './dto/createGroupedQuestion.dto';
import { GetGroupedQuestionDto } from './dto/getGroupedQuestion.dto';
import { UpdateGroupedQuestionDto } from './dto/updateGroupedQuestion.dto';
import { GroupedQuestionEntity } from './groupedQuestion.entity';

@Injectable()
export class GroupedQuestionService {
  constructor(
    @InjectRepository(GroupedQuestionEntity)
    private readonly groupedQuestionRepository: Repository<GroupedQuestionEntity>,
    private readonly pagesService: PagesService,
    @Inject(forwardRef(() => ProgressService))
    private readonly progressService: ProgressService,
  ) {}

  async getGroupedQuestion(
    getGroupedQuestionDto: GetGroupedQuestionDto,
  ): Promise<GroupedQuestionEntity[]> {
    const courseId = getGroupedQuestionDto.courseId,
      year = getGroupedQuestionDto.year,
      page = getGroupedQuestionDto.directionNumber;

    let visitedPage = await this.pagesService.findPage({
      courseId,
      year,
      userId: 1,
      page,
    });
    const totalQuestions = await this.groupedQuestionRepository.count({
      where: [
        {
          courseId: getGroupedQuestionDto.courseId,
          year: getGroupedQuestionDto.year,
        },
      ],
    });
    if (!visitedPage) {
      await this.pagesService.createNewPage({
        courseId,
        year,
        userId: 1,
        page,
        pageSize: 5,
        isSubmitted: false,
        startTime: Date.now(),
      });
      if (page === 1)
        await this.progressService.createNewProgress({
          courseId,
          year,
          userId: 1,
          totalQuestions,
          lastPage: page,
        });
    }
    return await this.groupedQuestionRepository.find({
      where: [
        {
          direction: getGroupedQuestionDto.directionId,
        },
      ],
    });
  }

  async getYearsOfGroupedQuestions(courseId: number) {
    let years = await this.groupedQuestionRepository
      .createQueryBuilder('q')
      .select('q.year', 'year')
      .where('q.courseId=:id', { id: courseId })
      .distinct(true)
      .getRawMany();
    return years;
  }

  async getGroupedQuestionById(id: number) {
    return await this.groupedQuestionRepository.findOne({
      where: [{ id: id }],
    });
  }
  async createGroupedQuestion(
    createGroupedQuestionDto: CreateGroupedQuestionDto,
  ) {
    let newGroupedQuestion = new GroupedQuestionEntity();
    Object.assign(newGroupedQuestion, createGroupedQuestionDto);
    return await this.groupedQuestionRepository.save(newGroupedQuestion);
  }

  async updateGroupedQuestion(
    id: number,
    updateGroupedQuestionDto: UpdateGroupedQuestionDto,
  ) {
    return await this.groupedQuestionRepository.update(
      { id: id },
      updateGroupedQuestionDto,
    );
  }
  async deleteGroupedQuestion(id: number) {
    return await this.groupedQuestionRepository.delete({ id: id });
  }
}
