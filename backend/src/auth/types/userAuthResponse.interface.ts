import { Role } from 'src/auth/types/role.enum';
import { StudentResponseDto } from 'src/student/dto/studentResponse.dto';
import { TeacherResponseDto } from 'src/teacher/dto/teacherResponse.dto';

export interface IUserAuthResponse {
  user:
    | StudentResponseDto
    | (TeacherResponseDto & { token: string } & { role: Role });
}
