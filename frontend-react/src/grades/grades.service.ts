import axios, { type AxiosResponse } from "axios";
import type { Grade } from "./grades.types";


export const getStudentAllGrades = async (studentId: number | null): Promise<Grade[]> => {
    const response: AxiosResponse<Grade[]> = await axios.get(`/api/grades/student/${studentId}`);
    return response.data;
}