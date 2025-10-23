import axios, { type AxiosResponse } from 'axios';
import type {
  SubjectResponse,
  SubjectNameResponse,
  UpdateSubject,
  CreateSubject,
  SubjectInfo,
} from '../types/subjects.types';

const getAuthHeaders = () => {
  const userString = localStorage.getItem('user');
  if (!userString) {
    return {};
  }
  const user = JSON.parse(userString);
  return { headers: { Authorization: `Bearer ${user.token}` } };
};

export const getSubjectsNames = async (): Promise<SubjectNameResponse[]> => {
  const response: AxiosResponse<SubjectNameResponse[]> = await axios.get(
    '/api/subjects'
  );
  return response.data;
};

export const getSubjectsInfo = async (): Promise<SubjectInfo[]> => {
  const response: AxiosResponse<SubjectInfo[]> = await axios.get(
    '/api/subjects/info'
  );
  return response.data;
};

export const createSubject = async (
  newSubject: CreateSubject
): Promise<SubjectResponse> => {
  const response: AxiosResponse<SubjectResponse> = await axios.post(
    '/api/subjects',
    newSubject,
    getAuthHeaders()
  );
  return response.data;
};

export const updateSubject = async (
  subjectId: number,
  newSubjectData: UpdateSubject
): Promise<SubjectResponse> => {
  const response: AxiosResponse<SubjectResponse> = await axios.patch(
    `/api/subjects/${subjectId}`,
    newSubjectData,
    getAuthHeaders()
  );
  return response.data;
};

export const deleteSubject = async (
  subjectId: number
): Promise<SubjectResponse> => {
  const response: AxiosResponse<SubjectResponse> = await axios.delete(
    `/api/subjects/${subjectId}`,
    getAuthHeaders()
  );
  return response.data;
};

export const addTeacherToSubject = async (
  teacherId: number,
  subjectId: number
): Promise<SubjectResponse> => {
  const body = { teacherId: teacherId };
  const response: AxiosResponse<SubjectResponse> = await axios.post(
    `/api/subjects/${subjectId}/teachers`,
    body,
    getAuthHeaders()
  );
  return response.data;
};

export const addStudentToSubject = async (
  studentId: number,
  subjectId: number
): Promise<SubjectResponse> => {
  const body = { studentId: studentId };
  const response: AxiosResponse<SubjectResponse> = await axios.post(
    `/api/subjects/${subjectId}/students`,
    body,
    getAuthHeaders()
  );
  return response.data;
};

export const removeTeacherFromSubject = async (
  teacherId: number,
  subjectId: number
): Promise<SubjectResponse> => {
  const body = { teacherId: teacherId };
  const response: AxiosResponse<SubjectResponse> = await axios.delete(
    `/api/subjects/${subjectId}/teachers`,
    {
      ...getAuthHeaders(),
      data: body,
    }
  );
  return response.data;
};

export const removeStudentFromSubject = async (
  studentId: number,
  subjectId: number
): Promise<SubjectResponse> => {
  const body = { studentId: studentId };
  const response: AxiosResponse<SubjectResponse> = await axios.delete(
    `/api/subjects/${subjectId}/students`,
    {
      ...getAuthHeaders(),
      data: body,
    }
  );
  return response.data;
};
