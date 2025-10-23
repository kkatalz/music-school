import axios, { type AxiosResponse } from "axios";
import type { StudentResponse } from "../auth/auth.types";
import type { Student, UpdateStudent } from "./student.types";


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
  const response: AxiosResponse<StudentResponse> = await axios.post("/api/students", student, getAuthHeaders());
  return response.data;
}

export const updateStudent = async(studentId: number, newStudentData: UpdateStudent) => {
  const response: AxiosResponse<StudentResponse> = await axios.put(`/api/students/${studentId}`, newStudentData, getAuthHeaders());
  return response.data;
}

export const deleteStudent = async (studentId: number): Promise<StudentResponse> => {
  const response: AxiosResponse<StudentResponse> = await axios.delete(`/api/students/${studentId}`, getAuthHeaders());
  return response.data;
}

export const getMyStudents = async (teacherId: number, year: number | null, semester: number | null): Promise<StudentResponse[]> => {
  const authConfig = getAuthHeaders();
  const params: { year?: number; semester?: number} = {}
  if (year !== null) {
    params.year = year;
  }

  if (semester !== null) {
    params.semester = semester;
  }
  const response: AxiosResponse<StudentResponse[]> = await axios.get(`/api/teachers/${teacherId}/students`, {
    params: params, 
    ...authConfig
  });

  return response.data;
}

export const getStudentsByPeriod = async(
  startDate: string, 
  endDate: string
): Promise<StudentResponse[]> => {
  const response: AxiosResponse<StudentResponse[]> = await axios.get(
    "/api/students", 
    {
      params: { start: startDate, end: endDate },
      ...getAuthHeaders()
    }
  );
  return response.data;
}

export const getTotalStudentsByPeriod = async(
  startDate: string, 
  endDate: string
): Promise<number> => {
  const response: AxiosResponse<number> = await axios.get(
    "/api/students/total", 
    {
      params: { start: startDate, end: endDate },
      ...getAuthHeaders()
    }
  );
  return response.data;
}