import { useQuery } from "@tanstack/react-query";
import { getStudentAllGrades } from "./grades.service";


export const useGetStudentAllGrades = (studentId: number | null) => {
     return useQuery({
        queryKey: ["studentAllGrades", studentId],
        queryFn: () =>  getStudentAllGrades(studentId),
        enabled: !!studentId,
      });
}
