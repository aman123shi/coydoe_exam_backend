import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CourseEntity } from '@app/course/course.entity';
import { CourseService } from '@app/course/course.service';
import { CreateCourseDto } from '@app/course/dtos/createCourse.dto';
import { UpdateCourseDto } from '@app/course/dtos/updateCourse.dto';

@Controller()
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get('courses')
  async getCourses(
    @Body('examCategoryId') examCategoryId: number,
  ): Promise<CourseEntity[]> {
    return await this.courseService.getCourses(examCategoryId);
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
    return await this.courseService.updateCourse(id, updateCourseDto);
  }
  @Delete('courses/:id')
  async deleteCourse(@Param('id') id: number) {
    return await this.courseService.deleteCourse(id);
  }
}
