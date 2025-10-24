import { useQuery } from "@tanstack/react-query";
import { getTeachers, 
  createTeacher, 
  deleteTeacher, 
  updateTeacher, 
  getTeacherById, 
  updateTeacherPassword,
getTeacherSubjects,
getStudentTeachers,
calculateExperience } from "./teachers.service";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from "react-router";
import type { CreateTeacher, UpdateTeacher } from "./teacher.types";


export const useTeachers = () => {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });
};

export const useGetTeacherById = (teacherId: number | null) => {
  return useQuery({
    queryKey: ["teacherById", teacherId],
    queryFn: () => getTeacherById(teacherId),
    enabled: !!teacherId,
  })
};


export const useCreateTeacher = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (newTeacher: CreateTeacher) => createTeacher(newTeacher),
    
    onSuccess: () => {
      // query to 'teachers' to update list
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      alert('Teacher was added!');
      navigate('/headTeacher/teachers'); 
    },
    onError: (err: any) => {
      alert(err);
      console.error("Error while creating:", err);
    }
  });
};


export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (teacherId: number) => deleteTeacher(teacherId),
    
    onSuccess: () => {
      // query to 'teachers' to update list
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      alert('Teacher was deleted!');
      navigate('/headTeacher/teachers'); 
    },
    onError: (err: any) => {
      alert(err);
      console.error("Error while deleting:", err);
    }
  });
};


export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
        mutationFn: ({ teacherId, newTeacherData }: { teacherId: number, newTeacherData: UpdateTeacher }) => 
          updateTeacher(teacherId, newTeacherData),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      alert('Teacher was updated!');
      navigate('/headTeacher/teachers'); 
    },
    onError: (err: any) => {
      alert(err);
      console.error("Error while deleting:", err);
    }
  });
};


export const useUpdateTeacherPassword = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation({
      mutationFn: (newPassword: string) => updateTeacherPassword(newPassword),

      onSuccess: () => {
        alert('Password was successfully updated!');
        // setNewPassword('');
        // setNewPasswordFinal('');
        queryClient.invalidateQueries({ queryKey: ['teachers'] });
      },
      onError: (err: any) => {
        console.error("Error while updating password:", err);
      }
    })
};


export const useGetTeacherSubjects = (
  teacherId: number | undefined,
  year: string,
  semester: string
) => {
  return useQuery({
    queryKey: ['mySubjects', teacherId, year, semester],

    queryFn: () => {
      const yearNum = year ? parseInt(year, 10) : null;
      const semesterNum = semester ? parseInt(semester, 10) : null;

      return getTeacherSubjects(teacherId!, yearNum, semesterNum);
    },

    enabled: !!teacherId
  })
}


export const useCalculateExperience = (teacherId: number | null) => {
  return useQuery({
    queryKey: ["teacherExperience", teacherId],
    queryFn: () => calculateExperience(teacherId),
    enabled: !!teacherId,
  })
};

export const useStudentTeachers = (
  studentId: number | undefined,
  year?: number,
  semester?: number
) => {
  return useQuery({
    queryKey: ["studentTeachers", studentId, year, semester],
    queryFn: () => getStudentTeachers(studentId!, year, semester),
    enabled: !!studentId,
  });
};