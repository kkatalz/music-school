import { useGetStudentAllGrades } from '../grades/useGrades';
import { useAuth } from '../auth/AuthContext';

export const StudentGrades = () => {
  const { user } = useAuth();
  const studentId = user ? Number(user.id) : null;

  const {
    data: grades,
    isLoading,
    isError,
    error,
  } = useGetStudentAllGrades(studentId);

  if (isLoading) {
    return <div className="text-center mt-10">Loading your grades...</div>;
  }

  if (isError) {
    return (
      <div className="text-center mt-10 text-red-600">
        Error: {error.message}
      </div>
    );
  }

  if (!grades || grades.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-600">
        <h3 className="text-xl">You don't have any grade yet.</h3>
        <p>As soon as teacher set you a grade, it will appear here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        My Grades
      </h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center border-b pb-2 mb-3">
          <span className="text-sm font-bold text-gray-600 uppercase">
            Class
          </span>
          <span className="text-sm font-bold text-gray-600 uppercase">
            Grade
          </span>
        </div>

        <div className="space-y-3">
          {grades.map((grade) => {
            const color =
              grade.value! >= 10
                ? 'text-green-600 font-semibold'
                : grade.value! >= 7
                ? 'text-yellow-600 font-semibold'
                : 'text-red-600 font-semibold';

            return (
              <div
                key={grade.id}
                className="flex justify-between items-center border-b border-gray-100 pb-2"
              >
                <span className="text-gray-800 text-sm">
                  {grade.subject?.name}
                </span>
                <span className={`text-base ${color}`}>{grade.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
