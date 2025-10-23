import type { StudentResponse } from "../auth/auth.types";
import { useGetStudentStudyYears } from "./useStudents";
interface StudentCardProps {
  student: StudentResponse;
  onEdit: () => void;
  onDelete: () => void;
}

export const StudentCard = ({ student, onEdit, onDelete }: StudentCardProps) => {
  const { data: studyYears, isLoading: isLoadingYears } = useGetStudentStudyYears(student.id);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col hover:shadow-xl transition-shadow duration-300">
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h2 className="text-xl font-bold text-gray-900">{student.firstName} {student.lastName}</h2>
      </div>

      <div className="space-y-3 flex-grow">
        <div className="flex items-center text-sm">
          <svg className="w-4 h-4 text-gray-400 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          <span className="text-gray-700 break-all">{student.email}</span>
        </div>
        <div className="flex items-center text-sm">
          <svg className="w-4 h-4 text-gray-400 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
          <span className="text-gray-700">{student.phone}</span>
        </div>
        <div className="flex items-center text-sm">
          <svg className="w-4 h-4 text-gray-400 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          <span className="text-gray-700">{student.parentPhone}</span>
        </div>
        <div className="flex items-center text-sm">
            <svg className="w-4 h-4 text-gray-400 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          <span className="text-gray-700">{student.address}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
        <span>Start study date: {new Date(student.startStudyDate).toLocaleDateString()}</span>
      </div>

      <div className="flex items-center justify-left text-xs mb-3">
        <span className="text-gray-500">Years of study:</span>
        {isLoadingYears ? (
          <span className="text-gray-400 italic ml-1">Loading...</span>
        ) : (
          <span className="font-medium text-blue-600 ml-1">
            {studyYears === 0
              ? 'Less than 1 year'
              : `${studyYears} ${studyYears === 1 ? 'year' : 'years'}`}
          </span>
        )}
      </div>

       <div className="flex space-x-2">
          <button 
            onClick={onEdit}
            className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
          >
            Edit
          </button>
          <button 
             onClick={onDelete}
            className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
          >
            Delete
          </button>
        </div>
    </div>
  );
};
