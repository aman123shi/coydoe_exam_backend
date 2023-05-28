import { PagesService } from '@app/progress/pages.service';
import { ProgressService } from '@app/progress/progress.service';
import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateGroupedQuestionDto } from './dto/createGroupedQuestion.dto';
import { GetGroupedQuestionDto } from './dto/getGroupedQuestion.dto';
import { UpdateGroupedQuestionDto } from './dto/updateGroupedQuestion.dto';
import {
  GroupedQuestion,
  GroupedQuestionDocument,
} from './schemas/groupedQuestion.schema';
import { DataClerkService } from '@app/dataClerk/dataClerk.service';
import { AdminService } from '@app/admin/admin.service';

@Injectable()
export class GroupedQuestionService {
  constructor(
    @InjectModel(GroupedQuestion.name)
    private groupedQuestionModel: Model<GroupedQuestionDocument>,
    @Inject(forwardRef(() => PagesService))
    private readonly pagesService: PagesService,
    @Inject(forwardRef(() => ProgressService))
    private readonly progressService: ProgressService,
    private readonly dataClerkService: DataClerkService,
    private readonly adminService: AdminService,
  ) {}

  async getGroupedQuestion(
    getGroupedQuestionDto: GetGroupedQuestionDto,
    userId: mongoose.Schema.Types.ObjectId,
  ): Promise<GroupedQuestion[]> {
    const courseId = getGroupedQuestionDto.courseId,
      year = getGroupedQuestionDto.year,
      page = getGroupedQuestionDto.directionNumber;

    const visitedPage = await this.pagesService.findPage({
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
  async getGroupedQuestionForAdmin(
    getGroupedQuestionDto: GetGroupedQuestionDto,
  ) {
    return await this.groupedQuestionModel
      .find({
        direction: getGroupedQuestionDto.directionId,
      })
      .sort({ questionNumber: 1 });
  }

  async getGroupedQuestionsV2(getGroupedQuestionDto: GetGroupedQuestionDto) {
    const groupedQuestions = await this.getGroupedQuestionForAdmin(
      getGroupedQuestionDto,
    );
    return { groupedQuestions };
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
    questionImage: string | null,
    descriptionImage: string | null,
    userId: mongoose.Schema.Types.ObjectId | undefined,
  ) {
    const newGroupedQuestion = new this.groupedQuestionModel();
    Object.assign(newGroupedQuestion, createGroupedQuestionDto);
    if (questionImage) newGroupedQuestion.questionImage = questionImage;
    if (descriptionImage)
      newGroupedQuestion.descriptionImage = descriptionImage;
    //check if this question is already inserted
    const questionExisted = await this.groupedQuestionModel.findOne({
      courseId: createGroupedQuestionDto.courseId,
      year: createGroupedQuestionDto.year,
      questionNumber: createGroupedQuestionDto.questionNumber,
    });
    if (questionExisted) {
      throw new UnprocessableEntityException('Question already Existed');
    }
    await this.dataClerkService.incrementQuestionEntered(userId);

    //insert data entry report for that day from dataClerkService(insert report)
    await this.dataClerkService.insertReport({
      clerkId: userId,
      courseId: createGroupedQuestionDto.courseId,
    });
    //increment admin notification for that user AdminService
    await this.adminService.incrementDataInsertionNotification(userId);
    return await newGroupedQuestion.save();
  }

  async updateGroupedQuestion(
    id: mongoose.Schema.Types.ObjectId,
    updateGroupedQuestionDto: UpdateGroupedQuestionDto,
    questionImage: string | null,
    descriptionImage: string | null,
  ): Promise<any> {
    if (questionImage) updateGroupedQuestionDto.questionImage = questionImage;
    if (descriptionImage)
      updateGroupedQuestionDto.descriptionImage = descriptionImage;
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

  async getGroupedQuestionsCount() {
    const count = await this.groupedQuestionModel.find().count();
    return count;
  }
  async getTotalQuestions(
    courseId: mongoose.Schema.Types.ObjectId,
    year: number,
  ) {
    let totalQuestions = 0;

    totalQuestions = await this.groupedQuestionModel
      .find({ courseId, year })
      .count();

    return totalQuestions;
  }
}
