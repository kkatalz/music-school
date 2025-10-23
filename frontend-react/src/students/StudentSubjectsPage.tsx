import { useStudentSubjects } from "../subjects/hooks/useSubjects";
import { useAuth } from "../auth/AuthContext";

interface Subject {
  id: number;
  name: string;
  studyYear: number;
  semester: number;
}

export const StudentSubjectsPage = () => {
  const { user } = useAuth();
  const { data: subjects, isLoading, error } = useStudentSubjects(user?.id || null) as {
    data: Subject[] | undefined;
    isLoading: boolean;
    error: any;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading subjects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        Error loading subjects. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-6">My Subjects</h2>
      </div>

      {subjects && subjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {subject.name}
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Study Year:</span>
                  <span className="font-medium text-gray-900">{subject.studyYear}</span>
                </div>
                <div className="flex justify-between">
                  <span>Semester:</span>
                  <span className="font-medium text-gray-900">{subject.semester}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-gray-600">No subjects found</p>
          <p className="text-gray-500 text-sm mt-2">You are not enrolled in any subjects yet</p>
        </div>
      )}
    </div>
  );
};