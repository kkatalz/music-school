import axios, { type AxiosResponse } from "axios";
import type { Teacher, CreateTeacher, UpdateTeacher } from "./teacher.types";


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
