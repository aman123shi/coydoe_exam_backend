import { Injectable } from '@nestjs/common';
import { CreateStudentTypeDTO } from './dtos/createStudentType.dto';
import { UpdateStudentTypeDto } from './dtos/updateStudentType.dto';
import { InjectModel } from '@nestjs/mongoose';
import { StudentType, StudentTypeDocument } from './schemas/studentType.schema';
import { Model } from 'mongoose';

@Injectable()
export class StudentTypeService {
  constructor(
    @InjectModel(StudentType.name)
    private studentTypeModel: Model<StudentTypeDocument>,
  ) {}

  async createStudentType(createStudentTypeDto: CreateStudentTypeDTO) {
    let newStudentType = new this.studentTypeModel();
    Object.assign(newStudentType, createStudentTypeDto);
    return await newStudentType.save();
  }

  async updateStudentType(
    id: string,
    updateStudentTypeDto: UpdateStudentTypeDto,
  ) {}
}
