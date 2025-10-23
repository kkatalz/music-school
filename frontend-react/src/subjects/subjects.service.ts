import axios, { type AxiosResponse } from "axios";
import type { SubjectResponse, SubjectNameResponse, UpdateSubject, CreateSubject } from "./subjects.types";


const getAuthHeaders = () => {
  const userString = localStorage.getItem('user');
  if (!userString) {
    return {};
  }
  const user = JSON.parse(userString);
  return { headers: { Authorization: `Bearer ${user.token}` } };
};


export const getSubjects = async (): Promise<SubjectResponse[]> => {
  const response: AxiosResponse<SubjectResponse[]> = await axios.get("/api/subjects/info");
  return response.data;
};

export const createSubject = async (newSubject: CreateSubject): Promise<SubjectResponse> => {
  const response: AxiosResponse<SubjectResponse> = await axios.post("/api/subjects", newSubject, getAuthHeaders());
  return response.data;
}


export const updateSubject = async (subjectId: number, newSubjectData: UpdateSubject): Promise<SubjectResponse> => {
  const response: AxiosResponse<SubjectResponse> = await axios.patch(`/api/subjects/${subjectId}`, newSubjectData, getAuthHeaders());
  return response.data;
}

export const deleteSubject = async (subjectId: number): Promise<SubjectResponse> => {
  const response: AxiosResponse<SubjectResponse> = await axios.delete(`/api/subjects/${subjectId}`, getAuthHeaders());
  return response.data;
}

export const addTeacherToSubject = async (teacherId: number, subjectId: number): Promise<SubjectResponse> => {
  const response: AxiosResponse<SubjectResponse> = await axios.post(`/api/subjects/${subjectId}/teachers`, teacherId, 
    getAuthHeaders());
    return response.data;
}

export const addStudentToSubject = async (studentId: number, subjectId: number): Promise<SubjectResponse> => {
  const response: AxiosResponse<SubjectResponse> = await axios.post(`/api/subjects/${subjectId}/students`, studentId, 
    getAuthHeaders());
    return response.data;
}







