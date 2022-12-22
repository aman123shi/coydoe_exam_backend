import { PagesService } from '@app/progress/pages.service';
import { ProgressService } from '@app/progress/progress.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateGroupedQuestionDto } from './dto/createGroupedQuestion.dto';
import { GetGroupedQuestionDto } from './dto/getGroupedQuestion.dto';
import { UpdateGroupedQuestionDto } from './dto/updateGroupedQuestion.dto';
import {
  GroupedQuestion,
  GroupedQuestionDocument,
} from './schemas/groupedQuestion.schema';

@Injectable()
export class GroupedQuestionService {
  constructor(
    @InjectModel(GroupedQuestion.name)
    private groupedQuestionModel: Model<GroupedQuestionDocument>,
    @Inject(forwardRef(() => PagesService))
    private readonly pagesService: PagesService,
    @Inject(forwardRef(() => ProgressService))
    private readonly progressService: ProgressService,
  ) {}

  async getGroupedQuestion(
    getGroupedQuestionDto: GetGroupedQuestionDto,
    userId: mongoose.Schema.Types.ObjectId,
  ): Promise<GroupedQuestion[]> {
    const courseId = getGroupedQuestionDto.courseId,
      year = getGroupedQuestionDto.year,
      page = getGroupedQuestionDto.directionNumber;

    let visitedPage = await this.pagesService.findPage({
      courseId,
      year,
      userId,
      page,
    });
    const totalQuestions = await this.groupedQuestionModel.count({
      courseId: getGroupedQuestionDto.courseId,
      year: getGroupedQuestionDto.year,
    });
    if (!visitedPage) {
      await this.pagesService.createNewPage({
        courseId,
        year,
        userId,
        page,
        pageSize: 5,
        isSubmitted: false,
        startTime: Date.now(),
      });
      if (page === 1)
        await this.progressService.createNewProgress({
          courseId,
          year,
          userId,
          totalQuestions,
          lastPage: page,
        });
    }
    return await this.groupedQuestionModel.find({
      direction: getGroupedQuestionDto.directionId,
    });
  }

  async getYearsOfGroupedQuestions(courseId: mongoose.Schema.Types.ObjectId) {
    return await this.groupedQuestionModel
      .find({ courseId: courseId })
      .select('year')
      .distinct('year');
  }

  async getGroupedQuestionById(id: mongoose.Schema.Types.ObjectId) {
    return await this.groupedQuestionModel.findOne({ _id: id });
  }
  async createGroupedQuestion(
    createGroupedQuestionDto: CreateGroupedQuestionDto,
  ) {
    let newGroupedQuestion = new this.groupedQuestionModel();
    Object.assign(newGroupedQuestion, createGroupedQuestionDto);
    return await newGroupedQuestion.save();
  }

  async updateGroupedQuestion(
    id: mongoose.Schema.Types.ObjectId,
    updateGroupedQuestionDto: UpdateGroupedQuestionDto,
  ): Promise<any> {
    return await this.groupedQuestionModel.updateOne(
      { _id: id },
      updateGroupedQuestionDto,
    );
  }
  async deleteGroupedQuestion(
    id: mongoose.Schema.Types.ObjectId,
  ): Promise<any> {
    return await this.groupedQuestionModel.deleteOne({ _id: id });
  }
}
