import { useQuery } from "@tanstack/react-query";
import { getTeachers, createTeacher, deleteTeacher, updateTeacher, getTeacherById } from "./teachers.service";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from "react-router";
import type { CreateTeacher, UpdateTeacher } from "./teacher.types";


// interface UpdateTeacherVariables {
//   teacherId: number;
//   newTeacherData: UpdateTeacher;
// }



export const useTeachers = () => {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });
};

export const useGetTeacherById = (teacherId: number) => {
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
        mutationFn: ({ teacherId, newTeacherData }: { teacherId: number, newTeacherData: any }) => 
          updateTeacher(teacherId, newTeacherData),
    
    onSuccess: () => {
      // query to 'teachers' to update list
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


