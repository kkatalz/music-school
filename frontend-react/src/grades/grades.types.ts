import type { SubjectNameResponse } from '../subjects/types/subjects.types';

export interface Grade {
  id: number;
  subject?: SubjectNameResponse;
  value?: number;
  student?: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export interface CreateGrade {
  studentId: number;
  subjectId: number;
  teacherId: number;
  value?: number;
}

export interface UpdateGrade {
  value: number;
}
