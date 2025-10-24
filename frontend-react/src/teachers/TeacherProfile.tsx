import { useGetTeacherById } from './useTeachers';
import { useAuth } from '../auth/AuthContext';
import { ChangeTeacherPasswordForm } from './ChangeTeacherPasswordForm';

export const TeacherProfile = () => {
  const { user } = useAuth();
  const teacherId = user ? Number(user.id) : null;

  const {
    data: teacher,
    isLoading,
    isError,
    error,
  } = useGetTeacherById(teacherId);

  if (isLoading) {
    return <div>Loading info...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!teacher) {
    return (
      <div className="text-center mt-10">Could not load teacher's data.</div>
    );
  }

  return (
    <div className="mx-auto max-w-124">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        My info
      </h2>

      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl">
        <div className="border-b pb-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900 ">
            {teacher.firstName} {teacher.lastName}
          </h1>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-gray-500 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              ></path>
            </svg>
            <span className="font-semibold text-gray-700">Email:</span>
            <span className="ml-2 text-gray-900">{teacher.email}</span>
          </div>

          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-gray-500 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              ></path>
            </svg>
            <span className="font-semibold text-gray-700">Phone number:</span>
            <span className="ml-2 text-gray-900">{teacher.phone}</span>
          </div>

          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-gray-500 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 14l9-5-9-5-9 5 9 5zm0 0v5.5M3 10l9 5 9-5M3 10v5.5"
              ></path>
            </svg>{' '}
            <span className="font-semibold text-gray-700">Education:</span>
            <span className="ml-2 text-gray-900">{teacher.education}</span>
          </div>

          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-gray-500 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>{' '}
            <span className="font-semibold text-gray-700">
              Start work date:
            </span>
            <span className="ml-2 text-gray-900">
              {new Date(teacher.startWorkDate).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-gray-500 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm9-1a2 2 0 100-4 2 2 0 000 4z"
              ></path>
            </svg>{' '}
            <span className="font-semibold text-gray-700">Position:</span>
            <span className="ml-2 text-gray-900">
              {teacher.isHeadTeacher ? 'Head Teacher' : 'Teacher'}
            </span>
          </div>
        </div>
      </div>
      {<ChangeTeacherPasswordForm></ChangeTeacherPasswordForm>}
    </div>
  );
};
