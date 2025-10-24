import axios, { type AxiosResponse } from 'axios';
import type { CreateGrade, Grade, UpdateGrade } from './grades.types';

export const setGrade = async (createGradeDto: CreateGrade): Promise<Grade> => {
  const response: AxiosResponse<Grade> = await axios.post(
    '/api/grades',
    createGradeDto
  );
  return response.data;
};

export const updateGrade = async (
  gradeId: number,
  updateGradeDto: UpdateGrade
): Promise<Grade> => {
  const response: AxiosResponse<Grade> = await axios.put(
    `/api/grades/${gradeId}`,
    updateGradeDto
  );
  return response.data;
};

export const getStudentGrades = async (
  studentId: number | null
): Promise<Grade[]> => {
  const response: AxiosResponse<Grade[]> = await axios.get(
    `/api/grades/student/${studentId}`
  );
  return response.data;
};

export const getGradesByTeacher = async (
  teacherId: number,
  filters?: {
    subjectName?: string;
    year?: number;
    semester?: number;
  }
): Promise<Grade[]> => {
  const params = new URLSearchParams();
  if (filters?.subjectName) params.append('subjectName', filters.subjectName);
  if (filters?.year) params.append('year', filters.year.toString());
  if (filters?.semester) params.append('semester', filters.semester.toString());

  const queryString = params.toString();
  const url = `/api/grades/teacher/${teacherId}${
    queryString ? `?${queryString}` : ''
  }`;

  const response: AxiosResponse<Grade[]> = await axios.get(url);
  return response.data;
};
