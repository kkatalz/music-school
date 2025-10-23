'use client';

import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDeleteSubject, useSubjectsInfo } from './hooks/useSubjects';

export const DeleteSubjectForm = () => {
  const [searchParams] = useSearchParams();
  const idFromUrl = searchParams.get('id');
  const initialId =
    idFromUrl && !Number.isNaN(Number(idFromUrl)) ? Number(idFromUrl) : null;

  const { data: subjects, isLoading } = useSubjectsInfo();
  const deleteSubjectMutation = useDeleteSubject();

  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(
    initialId
  );

  const selectedSubject =
    subjects?.find((s) => s.id === selectedSubjectId) ?? null;
  const teachers = selectedSubject?.teachers ?? [];
  const students = selectedSubject?.students ?? [];

  const handleDelete = () => {
    if (selectedSubjectId == null) {
      alert('Please select a subject to delete');
      return;
    }

    if (!selectedSubject) return;

    if (
      window.confirm(
        `Are you sure you want to delete "${selectedSubject.name}"?\n\nThis will remove:\n- ${teachers.length} teacher(s)\n- ${students.length} student(s)\n\nThis action cannot be undone.`
      )
    ) {
      deleteSubjectMutation.mutate(selectedSubjectId);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-8">
        <div className="text-center mt-10 text-gray-600">
          <p className="text-xl">Loading subjects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Delete Subject
        </h1>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Select Subject to Delete
            </label>
            <select
              id="subject"
              value={selectedSubjectId ?? ''}
              onChange={(e) =>
                setSelectedSubjectId(
                  e.target.value ? Number(e.target.value) : null
                )
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">-- Select a subject --</option>
              {subjects?.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name} (Year {subject.studyYear}, Semester{' '}
                  {subject.semester})
                </option>
              ))}
            </select>
          </div>

          {selectedSubject && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="font-semibold text-red-800 mb-3">
                Subject Details:
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Name:</span>{' '}
                  {selectedSubject.name}
                </p>
                <p>
                  <span className="font-semibold">Study Year:</span>{' '}
                  {selectedSubject.studyYear}
                </p>
                <p>
                  <span className="font-semibold">Semester:</span>{' '}
                  {selectedSubject.semester}
                </p>
                <p>
                  <span className="font-semibold">Teachers:</span>{' '}
                  {teachers.length > 0 ? teachers.join(', ') : 'None'}
                </p>
                <p>
                  <span className="font-semibold">Students:</span>{' '}
                  {students.length > 0 ? students.join(', ') : 'None'}
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleDelete}
              disabled={
                selectedSubjectId == null || deleteSubjectMutation.isPending
              }
              className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {deleteSubjectMutation.isPending
                ? 'Deleting...'
                : 'Delete Subject'}
            </button>
            <Link
              to="/headTeacher/subjects"
              className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
