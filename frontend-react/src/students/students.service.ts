import axios, { type AxiosResponse } from "axios";
import type { StudentResponse } from "../auth/auth.types";
import type { Student } from "./student.types";


const getAuthHeaders = () => {
  const userString = localStorage.getItem('user');
  if (!userString) {
    return {};
  }
  const user = JSON.parse(userString);
  return { headers: { Authorization: `Bearer ${user.token}` } };
};



export const getStudentInfo = async (studentId: number | null): Promise<StudentResponse> => {
    const response: AxiosResponse<StudentResponse> = await axios.get(`/api/students/${studentId}`, getAuthHeaders());
    return response.data;
}

export const updateStudentPassword = async(newPassword: string): Promise<StudentResponse> => {
    const payload = { password: newPassword};
    const response: AxiosResponse<StudentResponse> = await axios.patch(`/api/students/password`, payload, getAuthHeaders());
    return response.data;
}

export const getStudentStudyYears = async(studentId: number | null): Promise<number> => {
  const response: AxiosResponse<number> = await axios.get(`/api/students/${studentId}/study-years`, getAuthHeaders());
  return response.data;
}

export const getAllStudents = async(): Promise<StudentResponse[]> => {
  const response: AxiosResponse<StudentResponse[]> = await axios.get("/api/students");
  return response.data;
}

export const createStudent = async(student: Student): Promise<StudentResponse> => {
  const response: AxiosResponse<StudentResponse> = await axios.post("/api/students", student);
  return response.data;
}
