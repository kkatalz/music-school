import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateSubjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
