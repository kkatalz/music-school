import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateTeacherDto {
  @IsString()
  @IsOptional()
  readonly lastName?: string;

  @IsString()
  @IsOptional()
  readonly phone?: string;

  @IsString()
  @IsOptional()
  readonly education?: string;

  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @IsString()
  @IsOptional()
  readonly password?: string;

  @IsBoolean()
  @IsOptional()
  readonly isHeadTeacher?: boolean;
}
