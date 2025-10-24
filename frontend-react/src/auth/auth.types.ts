import { Role } from '../teachers/teacher.types';

export interface LoginCredentials {
  email: string;
  password: string;
}

interface BaseUser {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  token: string;
}

export interface StudentResponse extends BaseUser {
  role: Role.Student;
  parentPhone: string;
  address: string;
  startStudyDate: Date;
  subjects?: Array<{ id: number; name: string }>;
}

export interface TeacherResponse extends BaseUser {
  role: Role.Teacher | Role.HeadTeacher;
  education: string;
  startWorkDate: string;
  isHeadTeacher: boolean;
}

export type AuthResponse = StudentResponse | TeacherResponse;
