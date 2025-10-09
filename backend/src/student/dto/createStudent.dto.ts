import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateStudentDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  parentPhone: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  startStudyDate: Date;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}