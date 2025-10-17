import { Role } from 'src/auth/types/role.enum';

export class TeacherResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  education?: string;
  startWorkDate: Date;
  email: string;
  token: string;
  isHeadTeacher: boolean;
  role: Role;
}
