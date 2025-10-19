import axios, { type AxiosResponse } from "axios";
import type { Teacher } from "./teacher.types";

export const getTeachers = async (): Promise<Teacher[]> => {
  const response: AxiosResponse<Teacher[]> = await axios.get("/api/teachers");
  return response.data;
};
