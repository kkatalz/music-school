import { useQuery } from "@tanstack/react-query";
import { getStudentInfo, updateStudentPassword, getStudentStudyYears, getAllStudents, createStudent, 
  updateStudent, deleteStudent
} from "./students.service";
import type { StudentResponse } from "../auth/auth.types";
import type { Student } from "./student.types";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from "react-router";



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

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (newStudent: Student) => createStudent(newStudent),
    
    onSuccess: () => {
      // query to 'students' to update list
      queryClient.invalidateQueries({ queryKey: ['students'] });
      alert('Student was added!');
      navigate('/headTeacher/students'); 
    },
    onError: (err: any) => {
      alert(err);
      console.error("Error while creating:", err);
    }
  });
};


export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
        mutationFn: ({ studentId, newStudentData }: { studentId: number, newStudentData: any }) => 
          updateStudent(studentId, newStudentData),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      alert('Student was updated!');
      navigate('/headTeacher/students'); 
    },
    onError: (err: any) => {
      alert(err);
      console.error("Error while updating:", err);
    }
  });
};


export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (studentId: number) => deleteStudent(studentId),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      alert('Student was deleted!');
      navigate('/headTeacher/students'); 
    },
    onError: (err: any) => {
      alert(err);
      console.error("Error while deleting:", err);
    }
  });
};


