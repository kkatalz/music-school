import { useQuery } from "@tanstack/react-query";
import { getStudentInfo, updateStudentPassword, getStudentStudyYears} from "./students.service";


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