import { Injectable } from '@nestjs/common';
import { GetDirectionDto } from '@app/question/dto/getDirection.dto';
import { CreateDirectionDto } from '@app/question/dto/createDirection.dto';
import { UpdateDirectionDto } from '@app/question/dto/updateDirection.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Direction, DirectionDocument } from './schemas/direction.schema';
import { GroupedQuestionService } from './groupedQuestion.service';

@Injectable()
export class DirectionService {
  constructor(
    @InjectModel(Direction.name)
    private directionsModel: Model<DirectionDocument>,
    private readonly groupedQuestionService: GroupedQuestionService,
  ) {}

  async getDirections(getDirectionDto: GetDirectionDto): Promise<Direction[]> {
    return await this.directionsModel.find({
      course: getDirectionDto.courseId,
      courseYear: getDirectionDto.year,
    });
  }
  async getDirectionsCount(getDirectionDto: GetDirectionDto): Promise<number> {
    return await this.directionsModel
      .find({
        course: getDirectionDto.courseId,
        courseYear: getDirectionDto.year,
      })
      .count();
  }
  async getDirectionsV2(getDirectionDto: GetDirectionDto) {
    const directions = await this.getDirections(getDirectionDto);
    return { directions: directions };
  }
  async createDirection(createDirectionDto: CreateDirectionDto) {
    const newDirection = new this.directionsModel();
    Object.assign(newDirection, createDirectionDto);
    return await newDirection.save();
  }
  async getYearsOfAvailableDirection(courseId: mongoose.Schema.Types.ObjectId) {
    const years: Direction[] = await this.directionsModel
      .find({ course: courseId })
      .select('courseYear')
      .distinct('courseYear');

    return years.map((y) => ({ year: y }));
  }
  async updateDirection(
    id: mongoose.Schema.Types.ObjectId,
    updateDirectionDto: UpdateDirectionDto,
  ): Promise<any> {
    return await this.directionsModel.updateOne(
      { _id: id },
      updateDirectionDto,
    );
  }
  async deleteDirection(id: mongoose.Schema.Types.ObjectId): Promise<any> {
    await this.groupedQuestionService.deleteGroupedQuestionByDirectionId(id);
    return await this.directionsModel.deleteOne({ _id: id });
  }
}
