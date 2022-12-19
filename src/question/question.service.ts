import { CourseService } from '@app/course/course.service';
import { PagesService } from '@app/progress/pages.service';
import { ProgressService } from '@app/progress/progress.service';
import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { GetQuestionDto } from './dto/getQuestion.dto';
import { UpdateQuestionDto } from './dto/updateQuestion.dto';
import { GroupedQuestionService } from './groupedQuestion.service';
import { QuestionEntity } from './question.entity';
import { QuestionsWithCount } from './types/questionsWithCount';
//import { biology } from '@app/question';
@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
    private readonly courseService: CourseService,
    private readonly groupedQuestionService: GroupedQuestionService,
    private readonly pagesService: PagesService,
    @Inject(forwardRef(() => ProgressService))
    private readonly progressService: ProgressService,
  ) {}
  async getQuestionById(id: number) {
    let question = await this.questionRepository.findOne({
      where: [{ id: id }],
    });
    return question;
  }
  async getQuestion(
    getQuestionDto: GetQuestionDto,
    userId: number,
  ): Promise<QuestionsWithCount> {
    let limit = getQuestionDto.limit || 5;
    let page = getQuestionDto.page || 1;
    const course = getQuestionDto.course;
    const year = getQuestionDto.year;
    const subExamCategory = getQuestionDto.subCategory;
    let visitedPage = await this.pagesService.findPage({
      courseId: course,
      year,
      userId,
      page,
    });

    const [questions, count] = await this.questionRepository.findAndCount({
      where: [
        {
          course,
          year,
          subExamCategory,
        },
      ],
      skip: (page - 1) * limit,
      take: limit,
    });
    if (!visitedPage) {
      await this.pagesService.createNewPage({
        courseId: course,
        year,
        userId: 1,
        page,
        pageSize: limit,
        isSubmitted: false,
        startTime: Date.now(),
      });
      if (page === 1)
        await this.progressService.createNewProgress({
          courseId: course,
          year,
          userId: 1,
          totalQuestions: count,
          lastPage: page,
        });
    }
    return { questions, count };
  }

  async createQuestion(createQuestionDto: CreateQuestionDto) {
    let newQuestion = new QuestionEntity();
    Object.assign(newQuestion, createQuestionDto);
    return await this.questionRepository.save(newQuestion);
  }
  // async insertSample() {
  //   for (const q of biology) {
  //     let newQuestion = new QuestionEntity();
  //     Object.assign(newQuestion, q);
  //     await this.questionRepository.save(newQuestion);
  //   }
  //   return 'boom';
  // }
  async getCourseQuestionCount({
    courseId,
    year,
  }: {
    courseId: number;
    year: number;
  }) {
    return await this.questionRepository.count({
      where: [{ course: courseId, year }],
    });
  }
  async getAvailableYears(courseId: number) {
    let course = await this.courseService.getCourseById(courseId);
    if (!course) {
      throw new HttpException(
        'invalid Course ID ',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    try {
      let years = [];
      if (course.hasDirections == false)
        years = await this.questionRepository
          .createQueryBuilder('q')
          .select('q.year', 'year')
          .where('q.courseId=:id', { id: courseId })
          .distinct(true)
          .getRawMany();
      else {
        years = await this.groupedQuestionService.getYearsOfGroupedQuestions(
          courseId,
        );
      }
      console.log(years);
      return years;
    } catch (error) {
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
  async updateQuestion(id: number, updateQuestionDto: UpdateQuestionDto) {
    return await this.questionRepository.update({ id: id }, updateQuestionDto);
  }
  async deleteQuestion(id: number) {
    return await this.questionRepository.delete({ id: id });
  }
  async getRandomQuestion(getQuestionDto: GetQuestionDto) {
    console.log('subcategory ' + getQuestionDto.subCategory);

    return await this.questionRepository.find({
      where: [
        {
          course: getQuestionDto.course,
          year: getQuestionDto.year,
          subExamCategory: getQuestionDto.subCategory,
        },
      ],

      take: 5,
    });
  }
}

/*
 async createTestQuestion() {
    for (let index = 0; index < 10; index++) {
      let question = new QuestionEntity();
      question.questionText =
        'Q' + index + ' Social Math what is derivative of X+1';
      question.option_a = '1';
      question.option_b = 'x+2';
      question.option_c = 't-9';
      question.option_d = 't+9';
      question.answer = 'option_a';
      question.description = 'derivative of a x is 1 and constant is 0';
      question.image = 'img/question/img-2.jpg';
      question.course = 2;
      question.subExamCategory = 2;
      question.year = 2014;

      await this.questionRepository.save(question);
    }
  }


      return await this.questionRepository
      .createQueryBuilder('q')
      .select()
      .where('q.course = :course', {
        course: getQuestionDto.course,
      })
      .andWhere('q.year = :year', { year: getQuestionDto.year })
      .andWhere('q.subExamCategory = :subExamCategory', {
        subExamCategory: getQuestionDto.subCategory || '',
      })
      .take(5)

      .getMany();
*/
