import { useQuery } from "@tanstack/react-query";
import {
  createSubject,
  updateSubject,
  deleteSubject,
  addTeacherToSubject,
  addStudentToSubject,
  getSubjectsNames,
  getSubjectsInfo,
} from "../service/subjects.service";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import type { CreateSubject, UpdateSubject } from "../types/subjects.types";

export const useSubjects = () => {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjectsInfo,
  });
};

export const useSubjectsNames = () => {
  return useQuery({
    queryKey: ["subjectsNames"],
    queryFn: getSubjectsNames,
  });
};

export const useSubjectsInfo = () => {
  return useQuery({
    queryKey: ["subjectsInfo"],
    queryFn: getSubjectsInfo,
  });
};

export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (newSubject: CreateSubject) => createSubject(newSubject),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      alert("Subject was added!");
      navigate("/headTeacher/subjects");
    },
    onError: (err: any) => {
      console.error("Error while creating:", err);
    },
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (subjectId: number) => deleteSubject(subjectId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      alert("Subject was deleted!");
      navigate("/headTeacher/subjects");
    },
    onError: (err: any) => {
      console.error("Error while deleting:", err);
    },
  });
};

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({
      subjectId,
      newSubjectData,
    }: {
      subjectId: number;
      newSubjectData: UpdateSubject;
    }) => updateSubject(subjectId, newSubjectData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      alert("Subject was updated!");
      navigate("/headTeacher/subjects");
    },
    onError: (err: any) => {
      console.error("Error while updating:", err);
    },
  });
};

export const useAddTeacherToSubject = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({
      teacherId,
      subjectId,
    }: {
      teacherId: number;
      subjectId: number;
    }) => addTeacherToSubject(teacherId, subjectId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      alert("Teacher was added to the subject!");
      navigate("/headTeacher/subjects/addTeacherToSubject");
    },
    onError: (err: any) => {
      console.error("Error while adding:", err);
    },
  });
};

export const useAddStudentToSubject = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({
      studentId,
      subjectId,
    }: {
      studentId: number;
      subjectId: number;
    }) => addStudentToSubject(studentId, subjectId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      alert("Student was added to the subject!");
      navigate("/headTeacher/subjects/addStudentToSubject");
    },
    onError: (err: any) => {
      console.error("Error while adding:", err);
    },
  });
};
