import { useQuery } from "@tanstack/react-query";
import { getTeachers, createTeacher } from "./teachers.service";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from "react-router";
import type { CreateTeacher } from "./teacher.types";



export const useTeachers = () => {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });
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

