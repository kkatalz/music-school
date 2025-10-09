import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class UpdateTeacherDto {
  @IsString()
  readonly lastName: string;

  @IsString()
  readonly phone: string;

  @IsString()
  readonly education?: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsBoolean()
  readonly isHeadTeacher: boolean;
}
