import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DirectionEntity } from '@app/question/direction.entity';
import { GetDirectionDto } from '@app/question/dto/getDirection.dto';
import { CreateDirectionDto } from '@app/question/dto/createDirection.dto';
import { UpdateDirectionDto } from '@app/question/dto/updateDirection.dto';

@Injectable()
export class DirectionService {
  constructor(
    @InjectRepository(DirectionEntity)
    private readonly directionsRepository: Repository<DirectionEntity>,
  ) {}

  async getDirections(
    getDirectionDto: GetDirectionDto,
  ): Promise<DirectionEntity[]> {
    return await this.directionsRepository.find({
      where: [
        {
          course: getDirectionDto.courseId,
          courseYear: getDirectionDto.year,
        },
      ],
    });
  }
  async createDirection(createDirectionDto: CreateDirectionDto) {
    let newDirection = new DirectionEntity();
    Object.assign(newDirection, createDirectionDto);
    return await this.directionsRepository.save(newDirection);
  }

  async updateDirection(id: number, updateDirectionDto: UpdateDirectionDto) {
    return await this.directionsRepository.update(
      { id: id },
      updateDirectionDto,
    );
  }
  async deleteDirection(id: number) {
    return await this.directionsRepository.delete({ id: id });
  }
}
