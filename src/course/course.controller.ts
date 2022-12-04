import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CourseEntity } from '@app/course/course.entity';
import { CourseService } from '@app/course/course.service';
import { CreateCourseDto } from '@app/course/dtos/createCourse.dto';
import { UpdateCourseDto } from '@app/course/dtos/updateCourse.dto';
import { GetCoursesDto } from './dtos/getCourses.dto';
import { UpdateResult } from 'typeorm';
import { responseBuilder } from '@app/utils/http-response-builder';

@Controller()
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get('courses')
  async getCourses(
    @Body() getCoursesDto: GetCoursesDto,
  ): Promise<CourseEntity[]> {
    return await this.courseService.getCourses(getCoursesDto.examCategoryId);
  }

  @Post('courses')
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
  ): Promise<CourseEntity> {
    return await this.courseService.createCourse(createCourseDto);
  }

  @Put('courses/:id')
  async updateCourse(
    @Body() updateCourseDto: UpdateCourseDto,
    @Param('id') id: number,
  ) {
    let updateResult = await this.courseService.updateCourse(
      id,
      updateCourseDto,
    );
    if (updateResult instanceof UpdateResult) {
      return responseBuilder({ statusCode: 200, body: updateResult });
    }

    throw updateResult;
  }
  @Delete('courses/:id')
  async deleteCourse(@Param('id') id: number) {
    return await this.courseService.deleteCourse(id);
  }
}
