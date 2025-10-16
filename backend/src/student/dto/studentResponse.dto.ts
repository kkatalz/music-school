import { Role } from 'src/auth/types/role.enum';

export class StudentResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  parentPhone: string;
  address: string;
  startStudyDate: Date;
  email: string;
  token: string;
  role: Role;
}
