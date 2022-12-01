import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly hasDirections: boolean;

  @IsNotEmpty()
  @IsInt()
  readonly examCategory: number; //Entrance COC
}
