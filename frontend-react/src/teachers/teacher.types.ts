export enum Role {
  Student = "student",
  Teacher = "teacher",
  HeadTeacher = "headTeacher",
}

export interface Teacher {
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

export interface CreateTeacher {
  firstName: string;
  lastName: string;
  phone: string;
  education?: string;
  email: string;
  password: string;
  isHeadTeacher?: boolean;
}
