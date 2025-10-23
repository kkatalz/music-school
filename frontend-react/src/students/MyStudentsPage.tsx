import { useGetMyStudents } from "./useStudents"
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import type { StudentResponse } from "../auth/auth.types";



const StudentCard = ({ student }: { student: StudentResponse }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all hover:shadow-lg">
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800">
          {student.firstName} {student.lastName}
        </h3>
        <p className="text-sm text-gray-500 mb-4">{student.email}</p>

        <div className="space-y-2">
          <InfoRow label="Phone" value={student.phone} />
          <InfoRow label="Parent's Phone" value={student.parentPhone} />
          <InfoRow label="Address" value={student.address} />
          <InfoRow 
            label="Start Date" 
            value={new Date(student.startStudyDate).toLocaleDateString()} 
          />
        </div>
      </div>
    </div>
  );
};


const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-sm">
    <span className="font-medium text-gray-600">{label}:</span>
    <span className="text-gray-800 text-right">{value}</span>
  </div>
);


export const MyStudentsPage = () => {
  const { user } = useAuth();
  const teacherId = user?.id; 

  const [year, setYear] = useState<string>('');
  const [semester, setSemester] = useState<string>('');

  const { data: students, isLoading, isError, error } = useGetMyStudents(teacherId, year, semester);

  if (!user) {
    return <div className="p-4 text-center text-gray-500">Loading user data...</div>;
  }

  return (
    <div className="p-4 bg-gray-50 min-h-full space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Students for {user.firstName} {user.lastName}
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex-1">
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
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
          <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
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

      <div>
        {isLoading && (
          <p className="text-center text-gray-500 py-4">Loading students...</p>
        )}

        {isError && (
          <div className="text-center text-red-600 bg-red-50 p-4 rounded-md">
            <p className="font-semibold">Error fetching students:</p>
            <p>{(error as Error)?.message || 'An unknown error occurred'}</p>
          </div>
        )}

        {students && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center">
                No students found matching these criteria.
              </p>
            ) : (
              students.map(student => (
                <StudentCard key={student.id} student={student} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};