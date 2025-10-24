'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useGetMyStudents, useGetAllStudents } from '../students/useStudents';
import { useTeachers } from '../teachers/useTeachers';
import {
  useSetGrade,
  useUpdateGrade,
  useGetGradesByTeacher,
} from './useGrades';
import type { StudentResponse } from '../auth/auth.types';
import type { CreateGrade } from './grades.types';

export const ManageGradesPage = () => {
  const { user } = useAuth();
  const isHeadTeacher = user?.role === 'headTeacher';

  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(
    null
  );
  const [year, setYear] = useState<string>('');
  const [semester, setSemester] = useState<string>('');
  const [selectedStudent, setSelectedStudent] =
    useState<StudentResponse | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(
    null
  );
  const [gradeValue, setGradeValue] = useState<string>('');
  const [editingGradeId, setEditingGradeId] = useState<number | null>(null);

  const effectiveTeacherId: number | undefined = isHeadTeacher
    ? selectedTeacherId ?? undefined
    : user?.id;

  const { data: teachers } = useTeachers();

  const { data: myStudents, isLoading: isLoadingMyStudents } = useGetMyStudents(
    effectiveTeacherId,
    year,
    semester
  );
  const { data: allStudents, isLoading: isLoadingAllStudents } =
    useGetAllStudents();

  const students = isHeadTeacher ? allStudents : myStudents;
  const isLoadingStudents = isHeadTeacher
    ? isLoadingAllStudents
    : isLoadingMyStudents;

  const { data: existingGrades, isLoading: isLoadingGrades } =
    useGetGradesByTeacher(effectiveTeacherId || 0, {
      year: year ? Number(year) : undefined,
      semester: semester ? Number(semester) : undefined,
    });

  const { mutate: createGrade, isPending: isCreating } = useSetGrade();
  const { mutate: updateGrade, isPending: isUpdating } = useUpdateGrade();

  useEffect(() => {
    if (!isHeadTeacher && user?.id) {
      setSelectedTeacherId(user.id);
    }
  }, [isHeadTeacher, user?.id]);

  const handleSubmitGrade = () => {
    if (
      !selectedStudent ||
      !selectedSubjectId ||
      !gradeValue ||
      !effectiveTeacherId
    ) {
      alert('Please fill in all fields');
      return;
    }

    const value = Number(gradeValue);
    if (isNaN(value) || value < 1 || value > 12) {
      alert('Grade must be a number between 1 and 12');
      return;
    }

    if (editingGradeId) {
      updateGrade(
        { gradeId: editingGradeId, updateGradeDto: { value } },
        {
          onSuccess: () => {
            alert('Grade updated successfully!');
            resetForm();
          },
          onError: (error: any) => {
            alert(
              `Error updating grade: ${
                error.response?.data?.message || error.message
              }`
            );
          },
        }
      );
    } else {
      const createGradeDto: CreateGrade = {
        studentId: selectedStudent.id,
        subjectId: selectedSubjectId,
        teacherId: effectiveTeacherId,
        value: value,
      };

      createGrade(createGradeDto, {
        onSuccess: () => {
          alert('Grade created successfully!');
          resetForm();
        },
        onError: (error: any) => {
          alert(
            `Error creating grade: ${
              error.response?.data?.message || error.message
            }`
          );
        },
      });
    }
  };

  const resetForm = () => {
    setSelectedStudent(null);
    setSelectedSubjectId(null);
    setGradeValue('');
    setEditingGradeId(null);
  };

  const handleEditGrade = (
    gradeId: number,
    currentValue: number,
    studentId: number,
    subjectId: number
  ) => {
    const student = students?.find((s) => s.id === studentId);
    if (student) {
      setSelectedStudent(student);
      setSelectedSubjectId(subjectId);
      setGradeValue(currentValue.toString());
      setEditingGradeId(gradeId);
    }
  };

  if (!user) {
    return (
      <div className="p-4 text-center text-gray-500">Loading user data...</div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-full space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Manage Grades</h1>

      {isHeadTeacher && (
        <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <label
            htmlFor="teacher"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Teacher
          </label>
          <select
            id="teacher"
            value={selectedTeacherId || ''}
            onChange={(e) => {
              setSelectedTeacherId(Number(e.target.value) || null);
              resetForm();
            }}
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Teacher --</option>
            {teachers?.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.firstName} {teacher.lastName}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex-1">
          <label
            htmlFor="year"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Filter by Year
          </label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="e.g., 2"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="semester"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Filter by Semester
          </label>
          <select
            id="semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Semesters</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {editingGradeId ? 'Update Grade' : 'Create New Grade'}
        </h2>

        {isHeadTeacher && !selectedTeacherId && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
            Please select a teacher first to manage grades.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Student
            </label>
            <select
              value={selectedStudent?.id || ''}
              onChange={(e) => {
                const student = students?.find(
                  (s) => s.id === Number(e.target.value)
                );
                setSelectedStudent(student || null);
                setSelectedSubjectId(null);
              }}
              className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={
                isLoadingStudents || (isHeadTeacher && !selectedTeacherId)
              }
            >
              <option value="">-- Select Student --</option>
              {students?.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Subject
            </label>
            <select
              value={selectedSubjectId || ''}
              onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={
                !selectedStudent ||
                !selectedStudent.subjects ||
                selectedStudent.subjects.length === 0
              }
            >
              <option value="">-- Select Subject --</option>
              {selectedStudent?.subjects?.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            {selectedStudent &&
              (!selectedStudent.subjects ||
                selectedStudent.subjects.length === 0) && (
                <p className="mt-1 text-sm text-gray-500">
                  This student has no subjects assigned.
                </p>
              )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grade Value (1-12)
            </label>
            <input
              type="number"
              min="1"
              max="12"
              value={gradeValue}
              onChange={(e) => setGradeValue(e.target.value)}
              placeholder="Enter grade"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={handleSubmitGrade}
              disabled={
                isCreating ||
                isUpdating ||
                (isHeadTeacher && !selectedTeacherId)
              }
              className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isCreating || isUpdating
                ? 'Saving...'
                : editingGradeId
                ? 'Update Grade'
                : 'Create Grade'}
            </button>
            {editingGradeId && (
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Existing Grades
        </h2>
        {isLoadingGrades ? (
          <p className="text-center text-gray-500">Loading grades...</p>
        ) : !existingGrades || existingGrades.length === 0 ? (
          <p className="text-center text-gray-500">No grades found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="text-left p-3 font-semibold text-gray-700">
                    Student
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-700">
                    Subject
                  </th>
                  <th className="text-center p-3 font-semibold text-gray-700">
                    Grade
                  </th>
                  <th className="text-center p-3 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {existingGrades.map((grade) => (
                  <tr key={grade.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      {grade.student?.firstName} {grade.student?.lastName}
                    </td>
                    <td className="p-3">{grade.subject?.name}</td>
                    <td className="p-3 text-center">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 font-bold rounded">
                        {grade.value}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() =>
                          handleEditGrade(
                            grade.id,
                            grade.value!,
                            grade.student!.id,
                            grade.subject!.id
                          )
                        }
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
