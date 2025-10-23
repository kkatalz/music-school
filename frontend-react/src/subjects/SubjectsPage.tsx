'use client';
import { Link } from 'react-router';
import { useState } from 'react';
import { useSubjectsNames, useSubjectsInfo } from './hooks/useSubjects';
import { SubjectCard } from './SubjectCard';

type ViewMode = 'names' | 'info';

export const SubjectsPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('info');

  const {
    data: subjectNames,
    isLoading: isLoadingNames,
    isError: isErrorNames,
    error: errorNames,
  } = useSubjectsNames();
  const {
    data: subjectsInfo,
    isLoading: isLoadingInfo,
    isError: isErrorInfo,
    error: errorInfo,
  } = useSubjectsInfo();

  const isLoading = viewMode === 'names' ? isLoadingNames : isLoadingInfo;
  const isError = viewMode === 'names' ? isErrorNames : isErrorInfo;
  const error = viewMode === 'names' ? errorNames : errorInfo;

  if (isLoading) {
    return (
      <div className="p-4 sm:p-8">
        <div className="text-center mt-10 text-gray-600">
          <p className="text-xl">Loading subjects...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 sm:p-8">
        <div className="text-center mt-10 text-red-600 bg-red-50 p-8 rounded-lg">
          <h3 className="text-xl font-semibold">Error loading subjects</h3>
          <p>{error?.message || 'Something went wrong'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Subject List</h1>

        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('names')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              viewMode === 'names'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Names Only
          </button>
          <button
            onClick={() => setViewMode('info')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              viewMode === 'info'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Full Info
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <Link
          to="/headTeacher/subjects/new"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-sm"
        >
          Add Subject
        </Link>

        <Link
          to={`/headTeacher/subjects/update`}
          className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Edit
        </Link>

        <Link
          to="/headTeacher/subjects/delete"
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors shadow-sm"
        >
          Delete Subject
        </Link>
      </div>
      <div className="flex flex-wrap gap-3 mb-6">
        <Link
          to="/headTeacher/subjects/addTeacherToSubject"
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors shadow-sm"
        >
          Add Teacher to Subject
        </Link>

        <Link
          to="/headTeacher/subjects/addStudentToSubject"
          className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors shadow-sm"
        >
          Add Student to Subject
        </Link>
      </div>
      <div className="flex flex-wrap gap-3 mb-6">
        <Link
          to="/headTeacher/subjects/removeTeacherFromSubject"
          className="px-4 py-2 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-700 transition-colors shadow-sm"
        >
          Remove Teacher from Subject
        </Link>

        <Link
          to="/headTeacher/subjects/removeStudentFromSubject"
          className="px-4 py-2 bg-pink-600 text-white font-semibold rounded-md hover:bg-pink-700 transition-colors shadow-sm"
        >
          Remove Student from Subject
        </Link>
      </div>

      {viewMode === 'names' ? (
        // Names View - Simple list
        !subjectNames || subjectNames.length === 0 ? (
          <div className="text-center mt-10 text-gray-600 bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl">No subjects at the moment.</h3>
            <p>As soon as they are added, you will see them here.</p>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-md">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Subject Names
              </h2>
              <ul className="space-y-2">
                {subjectNames.map((subject) => (
                  <li
                    key={subject.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <span className="text-lg text-gray-700">
                      {subject.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      ID: {subject.id}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      ) : // Info View - Detailed cards
      !subjectsInfo || subjectsInfo.length === 0 ? (
        <div className="text-center mt-10 text-gray-600 bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-xl">No subjects at the moment.</h3>
          <p>As soon as they are added, you will see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectsInfo.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      )}
    </div>
  );
};
