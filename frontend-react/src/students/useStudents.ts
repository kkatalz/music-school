import { useQuery } from "@tanstack/react-query";
import { getStudentInfo, updateStudentPassword, getStudentStudyYears, getAllStudents, createStudent} from "./students.service";
import type { StudentResponse } from "../auth/auth.types";
import type { Student } from "./student.types";


export const useGetStudentInfo = (studentId: number | null) => {
     return useQuery({
        queryKey: ["studentInfo", studentId],
        queryFn: () =>  getStudentInfo(studentId),
        enabled: !!studentId,
      });
}

export const useGetStudentStudyYears = (studendId: number | null) => {
  return useQuery({
    queryKey: ["studentStudyYears", studendId],
    queryFn: () =>  getStudentStudyYears(studendId),
    enabled: !!studendId,
      });
}

export const useGetAllStudents = () => {
    return useQuery({
      queryKey: ["students"],
      queryFn: getAllStudents,
    });
}

export const useCreateStudent = (student: Student) => {
 return useQuery({
      queryKey: ["addStudent", student],
      queryFn: () => createStudent(student),
    }); 
}