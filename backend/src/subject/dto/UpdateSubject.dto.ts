import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateSubjectDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly studyYear?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly semester?: number;
}
