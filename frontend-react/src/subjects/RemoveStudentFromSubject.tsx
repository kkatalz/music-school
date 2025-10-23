'use client';

import type React from 'react';

import { useState } from 'react';
import { Link } from 'react-router';
import {
  useRemoveStudentFromSubject,
  useSubjectsInfo,
} from './hooks/useSubjects';

export const RemoveStudentFromSubject = () => {
  const [subjectId, setSubjectId] = useState<string>('');
  const [studentId, setStudentId] = useState<string>('');

  const { data: subjects, isLoading } = useSubjectsInfo();
  const removeStudentMutation = useRemoveStudentFromSubject();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subjectIdNum = Number.parseInt(subjectId);
    const studentIdNum = Number.parseInt(studentId);

    if (isNaN(subjectIdNum) || isNaN(studentIdNum)) {
      alert('Please enter valid numbers');
      return;
    }

    // Find the subject to verify student exists
    const subject = subjects?.find((s) => s.id === subjectIdNum);
    if (!subject) {
      alert('Subject not found');
      return;
    }

    if (!subject.students?.includes(studentIdNum)) {
      alert('This student is not assigned to this subject');
      return;
    }

    removeStudentMutation.mutate({
      studentId: studentIdNum,
      subjectId: subjectIdNum,
    });
  };

  const selectedSubject = subjects?.find(
    (s) => s.id === Number.parseInt(subjectId)
  );

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          to="/headTeacher/subjects"
          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          ← Back to Subjects
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Remove Student from Subject
        </h1>

        {isLoading ? (
          <p className="text-gray-600">Loading subjects...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="subjectId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Subject
              </label>
              <select
                id="subjectId"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select a subject</option>
                {subjects?.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name} (ID: {subject.id})
                  </option>
                ))}
              </select>
            </div>

            {selectedSubject && (
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Students assigned to this subject:
                </p>
                {selectedSubject.students?.length === 0 ? (
                  <p className="text-gray-500 text-sm">No students assigned</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedSubject.students?.map((id) => (
                      <span
                        key={id}
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                      >
                        Student ID: {id}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div>
              <label
                htmlFor="studentId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Student ID
              </label>
              <input
                type="number"
                id="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter student ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={removeStudentMutation.isPending}
              className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {removeStudentMutation.isPending
                ? 'Removing...'
                : 'Remove Student'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
