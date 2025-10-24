import axios, { type AxiosResponse } from "axios";
import type { Teacher, CreateTeacher, UpdateTeacher } from "./teacher.types";
import type { SubjectResponse } from "../subjects/types/subjects.types";


const getAuthHeaders = () => {
  const userString = localStorage.getItem('user');
  if (!userString) {
    return {};
  }
  const user = JSON.parse(userString);
  return { headers: { Authorization: `Bearer ${user.token}` } };
};


export const getTeachers = async (): Promise<Teacher[]> => {
  const response: AxiosResponse<Teacher[]> = await axios.get("/api/teachers");
  return response.data;
};

export const createTeacher = async (newTeacher: CreateTeacher): Promise<Teacher> => {
  const response: AxiosResponse<Teacher> = await axios.post("/api/teachers", newTeacher, getAuthHeaders());
  return response.data;
}

export const deleteTeacher = async (teacherId: number): Promise<Teacher> => {
  const response: AxiosResponse<Teacher> = await axios.delete(`/api/teachers/${teacherId}`, getAuthHeaders());
  return response.data;
}

export const updateTeacher = async (teacherId: number, newTeacherData: UpdateTeacher): Promise<Teacher> => {
  const response: AxiosResponse<Teacher> = await axios.patch(`/api/teachers/${teacherId}`, newTeacherData, getAuthHeaders());
  return response.data;
}

export const getTeacherById = async(teacherId: number | null): Promise<Teacher> => {
  const response: AxiosResponse<Teacher> = await axios.get(`/api/teachers/${teacherId}`, getAuthHeaders());
  return response.data;
}

export const updateTeacherPassword = async(newPassword: string): Promise<Teacher> => {
    const payload = { password: newPassword};
    const response: AxiosResponse<Teacher> = await axios.patch(`/api/teachers/password`, payload, getAuthHeaders());
    return response.data;
}


export const getTeacherSubjects = async(
  teacherId: number, 
  year: number | null, 
  semester: number | null): Promise<SubjectResponse[]> => {

  const authConfig = getAuthHeaders();
  const params: { year?: number; semester?: number} = {}
  if (year !== null) {
    params.year = year;
  }

  if (semester !== null) {
    params.semester = semester;
  }

  const response: AxiosResponse<SubjectResponse[]> = await axios.get(`/api/teachers/${teacherId}/subjects`, 
    {
      params: params,
      ...authConfig
    }
  );

  return response.data;
}

export const calculateExperience = async(
  teacherId: number | null
): Promise<Number> => {
  
  const response: AxiosResponse<Number> = await axios.get(`/api/teachers/experience/${teacherId}`);
  return response.data;
}