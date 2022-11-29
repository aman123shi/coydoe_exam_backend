import { Injectable } from '@nestjs/common';
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
  ) {}

  async getGroupedQuestion(
    getGroupedQuestionDto: GetGroupedQuestionDto,
  ): Promise<GroupedQuestionEntity[]> {
    return await this.groupedQuestionRepository.find({
      where: [
        {
          direction: getGroupedQuestionDto.directionId,
        },
      ],
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
