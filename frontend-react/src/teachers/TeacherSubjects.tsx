import { useGetTeacherSubjects } from "./useTeachers";
import { useParams } from "react-router";
import { useState } from "react";
import { useGetTeacherById } from "./useTeachers";
import type { SubjectInfo } from "../subjects/types/subjects.types";

interface SubjectCardProps {
  subject: SubjectInfo;
}


const SubjectCard  =({ subject }: SubjectCardProps) => {
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
};


export const TeacherSubjects = () => {   
  const { teacherId } = useParams<{ teacherId: string }>();
  const numTeacherId = Number(teacherId);

  // get info about teacher
  const { data: teacher } = useGetTeacherById(numTeacherId);

  const [year, setYear] = useState<string>('');
  const [semester, setSemester] = useState<string>('');

  const { 
    data: subjects, 
    isLoading, 
    isError 
  } = useGetTeacherSubjects(numTeacherId, year, semester);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Subjects of Teacher {teacher?.firstName} {teacher?.lastName}
      </h1>

      {/* filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex gap-4">
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">
            Year
          </label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="e.g., 3"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
            Semester
          </label>
          <input
            type="number"
            id="semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            placeholder="e.g., 1"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Student data --- */}
      {isLoading && (
        <div className="text-center text-gray-600">Loading students...</div>
      )}

      {isError && (
        <div className="text-center text-red-600">Error loading students.</div>
      )}

      {!isLoading && !isError && subjects && (
        <>
          {subjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map(subject => (
                <SubjectCard 
                key={subject.id}
                subject={subject} 
                 />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No subjects found for these criteria.
            </div>
          )}
        </>
      )}
    </div>
  );
};
