import { useQuery } from "@tanstack/react-query";
import { getSubjects, createSubject, updateSubject, deleteSubject, addTeacherToSubject, 
  addStudentToSubject
 } from "./subjects.service";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import type { CreateSubject, UpdateSubject } from "./subjects.types";


export const useSubjects = () => {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });
};


export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (newSubject: CreateSubject) => createSubject(newSubject),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      alert('Subject was added!');
      navigate('/headTeacher/subjects'); 
    },
    onError: (err: any) => {
      console.error("Error while creating:", err);
    }
  });
};


export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (subjectId: number) => deleteSubject(subjectId),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      alert('Subject was deleted!');
      navigate('/headTeacher/subjects'); 
    },
    onError: (err: any) => {
      console.error("Error while deleting:", err);
    }
  });
};


export const useUpdateSubject = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
        mutationFn: ({ subjectId, newSubjectData }: { subjectId: number, newSubjectData: UpdateSubject }) => 
          updateSubject(subjectId, newSubjectData),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      alert('Subject was updated!');
      navigate('/headTeacher/subjects'); 
    },
    onError: (err: any) => {
      console.error("Error while deleting:", err);
    }
  });
};


export const useAddTeacherToSubject = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
        mutationFn: ({ teacherId, subjectId }: { teacherId: number, subjectId: number }) => 
          addTeacherToSubject(teacherId, subjectId),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      alert('Teacher was added to the subject!');
      navigate('/headTeacher/subjects/addTeacherToSubject'); 
    },
    onError: (err: any) => {
      console.error("Error while deleting:", err);
    }
  });
};

export const useAddStudentToSubject = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
        mutationFn: ({ studentId, subjectId }: { studentId: number, subjectId: number }) => 
          addStudentToSubject(studentId, subjectId),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      alert('Student was added to the subject!');
      navigate('/headTeacher/subjects/addStudentToSubject'); // TODO: add this path to App.tsx
    },
    onError: (err: any) => {
      console.error("Error while deleting:", err);
    }
  });
};



