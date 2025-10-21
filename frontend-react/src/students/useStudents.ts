import { useQuery } from "@tanstack/react-query";
import { getStudentInfo, updateStudentPassword } from "./students.service";


export const useGetStudentInfo = (studentId: number | null) => {
     return useQuery({
        queryKey: ["studentInfo", studentId],
        queryFn: () =>  getStudentInfo(studentId),
        enabled: !!studentId,
      });
}