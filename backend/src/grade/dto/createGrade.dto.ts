import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class CreateGradeDto {
  @IsNumber()
  @IsNotEmpty()
  studentId: number;

  @IsNumber()
  @IsNotEmpty()
  subjectId: number;

  @IsNumber()
  @IsNotEmpty()
  teacherId: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(12)
  value?: number;
}
