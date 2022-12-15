import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CourseEntity } from '@app/course/course.entity';
import { CourseService } from '@app/course/course.service';
import { CreateCourseDto } from '@app/course/dtos/createCourse.dto';
import { UpdateCourseDto } from '@app/course/dtos/updateCourse.dto';
import { GetCoursesDto } from './dtos/getCourses.dto';
import { UpdateResult } from 'typeorm';
import { responseBuilder } from '@app/utils/http-response-builder';
import { AdminGuard } from '@app/admin/guards/admin.guard';
import { Public } from '@app/admin/decorators/publicRoute.decorators';

@Controller()
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get('courses/:examCategoryId')
  @Public()
  async getCourses(
    @Param('examCategoryId') examCategoryId: number,
  ): Promise<CourseEntity[]> {
    return await this.courseService.getCourses(examCategoryId);
  }

  @Get('courses/get/sub-exam-categories/:id')
  async getSubCategories(@Param('id') id: number) {
    return await this.courseService.getSubExamCategories(id);
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
