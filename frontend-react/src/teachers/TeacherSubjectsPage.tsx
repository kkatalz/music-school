import { useAuth } from "../auth/AuthContext";
import { useState } from "react";
import { useGetTeacherSubjects } from "./useTeachers";
import type { SubjectInfo } from "../subjects/types/subjects.types";

const SubjectCard = ({ subject }: {subject: SubjectInfo}) => {
    return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{subject.name}</h2>
        <div className="flex gap-2"></div>
        <span className="text-sm text-gray-500">ID: {subject.id}</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">Study Year:</span>
          <span className="text-gray-600">{subject.studyYear}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">Semester:</span>
          <span className="text-gray-600">{subject.semester}</span>
        </div>

      </div>
    </div>
  );
}

export const TeacherSubjectsPage = () => {
    const { user } = useAuth();
    const teacherId = user?.id; 

      const [year, setYear] = useState<string>('');
      const [semester, setSemester] = useState<string>('');
    
      const { data: subjects, isLoading, isError, error } = useGetTeacherSubjects(teacherId, year, semester);

        if (!user) {
    return <div className="p-4 text-center text-gray-500">Loading user data...</div>;
  }

    

    return (
       <div className="p-4 bg-gray-50 min-h-full space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Subjects for {user.firstName} {user.lastName}
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
          <p className="text-center text-gray-500 py-4">Loading subjects...</p>
        )}

        {isError && (
          <div className="text-center text-red-600 bg-red-50 p-4 rounded-md">
            <p className="font-semibold">Error fetching subjects:</p>
            <p>{(error as Error)?.message || 'An unknown error occurred'}</p>
          </div>
        )}

        {subjects && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center">
                No subjects found matching these criteria.
              </p>
            ) : (
              subjects.map(subject => (
                <SubjectCard key={subject.id} subject={subject} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
    )

}