import { Role } from 'src/auth/types/role.enum';

export class TeacherResponseDto {
  id: number;
  lastName: string;
  phone: string;
  email: string;
  token: string;
  isHeadTeacher: boolean;
  role: Role;
}
