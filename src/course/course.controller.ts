import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from '@app/course/course.service';
import { CreateCourseDto } from '@app/course/dtos/createCourse.dto';
import { UpdateCourseDto } from '@app/course/dtos/updateCourse.dto';
import { responseBuilder } from '@app/question/utils/http-response-builder';
import { Public } from '@app/admin/decorators/publicRoute.decorators';
import { Course } from './schemas/course.schema';
import mongoose from 'mongoose';

@Controller()
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get('courses/:examCategoryId')
  @Public()
  async getCourses(
    @Param('examCategoryId') examCategoryId: mongoose.Schema.Types.ObjectId,
    @Query('type') query: string | undefined | null, //?type=grouped|plain
  ): Promise<Course[]> {
    return await this.courseService.getCourses(examCategoryId, query);
  }

  @Get('courses/get/all')
  async getAllCourses(
    @Query('type') query: string | undefined | null, //?type=grouped|plain
  ): Promise<Course[]> {
    return await this.courseService.getAllCourses(query);
  }

  @Get('courses/get/sub-exam-categories/:id')
  async getSubCategories(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return await this.courseService.getSubExamCategories(id);
  }
  @Post('courses')
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
  ): Promise<Course> {
    return await this.courseService.createCourse(createCourseDto);
  }

  @Put('courses/:id')
  async updateCourse(
    @Body() updateCourseDto: UpdateCourseDto,
    @Param('id') id: mongoose.Schema.Types.ObjectId,
  ) {
    let updateResult = await this.courseService.updateCourse(
      id,
      updateCourseDto,
    );
    if (updateResult) {
      return responseBuilder({ statusCode: 200, body: updateResult });
    }

    throw updateResult;
  }
  @Delete('courses/:id')
  async deleteCourse(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return await this.courseService.deleteCourse(id);
  }
}
