import axios, { type AxiosResponse } from "axios";
import type { Teacher, CreateTeacher } from "./teacher.types";


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
