import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getGradesByTeacher,
  getStudentGrades,
  setGrade,
  updateGrade,
} from './grades.service';
import type { CreateGrade, UpdateGrade } from './grades.types';

export const useSetGrade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (createGradeDto: CreateGrade) => setGrade(createGradeDto),
    onSuccess: () => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['studentGrades'] });
      queryClient.invalidateQueries({ queryKey: ['teacherGrades'] });
    },
  });
};

export const useUpdateGrade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      gradeId,
      updateGradeDto,
    }: {
      gradeId: number;
      updateGradeDto: UpdateGrade;
    }) => updateGrade(gradeId, updateGradeDto),
    onSuccess: () => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['studentAllGrades'] });
      queryClient.invalidateQueries({ queryKey: ['teacherGrades'] });
    },
  });
};

export const useGetStudentAllGrades = (studentId: number | null) => {
  return useQuery({
    queryKey: ['studentAllGrades', studentId],
    queryFn: () => getStudentGrades(studentId),
    enabled: !!studentId,
  });
};

export const useGetGradesByTeacher = (
  teacherId: number | null,
  filters?: {
    subjectName?: string;
    year?: number;
    semester?: number;
  }
) => {
  return useQuery({
    queryKey: ['teacherGrades', teacherId, filters],
    queryFn: () => getGradesByTeacher(teacherId!, filters),
    enabled: !!teacherId,
  });
};
