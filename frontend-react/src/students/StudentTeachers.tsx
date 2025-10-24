import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useStudentTeachers } from '../teachers/useTeachers';

export const StudentTeachers = () => {
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [selectedSemester, setSelectedSemester] = useState<number | undefined>(undefined);
  
  const { data: teachers, isLoading, error } = useStudentTeachers(
    user?.id,
    selectedYear,
    selectedSemester
  );

  if (isLoading) {
    return <div className="text-center py-8">Loading teachers...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading teachers: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">My Teachers</h1>
      
      <div className="bg-white p-4 rounded-lg shadow flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Study Year
          </label>
          <select
            value={selectedYear ?? ''}
            onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : undefined)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All years</option>
            <option value="1">1st year</option>
            <option value="2">2nd year</option>
            <option value="3">3rd year</option>
            <option value="4">4th year</option>
            <option value="5">5th year</option>
            <option value="6">6th year</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Semester
          </label>
          <select
            value={selectedSemester ?? ''}
            onChange={(e) => setSelectedSemester(e.target.value ? Number(e.target.value) : undefined)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All semesters</option>
            <option value="1">1st semester</option>
            <option value="2">2nd semester</option>
          </select>
        </div>
      </div>

      {teachers && teachers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {teacher.firstName} {teacher.lastName}
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Email:</span> {teacher.email}
                </p>
                {teacher.phone && (
                  <p>
                    <span className="font-medium">Phone:</span> {teacher.phone}
                  </p>
                )}
                {teacher.education && (
                  <p>
                    <span className="font-medium">Education:</span> {teacher.education}
                  </p>
                )}
                {teacher.isHeadTeacher && (
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    Head Teacher
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No teachers found for the selected filters.</p>
        </div>
      )}
    </div>
  );
};