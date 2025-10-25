import type { Teacher } from './teacher.types';
import type { JSX } from 'react';
import { Link } from 'react-router';
import { useCalculateExperience,
  useGetTeacherSubjects,
  useGetTeacherStudents
 } from './useTeachers';
 import { useAuth } from '../auth/AuthContext';

interface TeacherCardProps {
  teacher: Teacher;
  onEdit: () => void;
  onDelete: () => void;
}

const ICONS = {
  email: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      ></path>
    </svg>
  ),
  phone: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      ></path>
    </svg>
  ),
  education: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      ></path>
    </svg>
  ),
};

const InfoRow = ({
  icon,
  label,
}: {
  icon: JSX.Element;
  label: React.ReactNode;
}) => (
  <div className="flex items-center text-sm">
    <div className="w-4 h-4 text-gray-400 mr-3 shrink-0">{icon}</div>
    <span className="text-gray-700 break-all">{label}</span>
  </div>
);

export const TeacherCard = ({
  teacher,
  onEdit,
  onDelete,
}: TeacherCardProps) => {
    const { user } = useAuth();
    const teacherId = user ? Number(user.id) : null;
    const canDelete = teacherId !== teacher.id;
  

  // get teacher's experience to display it on the card
  const { data: experience } = useCalculateExperience(teacher.id); 

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col hover:shadow-xl transition-shadow duration-300">
      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {teacher.firstName} {teacher.lastName}
          </h2>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold
              ${
                teacher.isHeadTeacher
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
          >
            {teacher.isHeadTeacher ? 'Head Teacher' : 'Teacher'}
          </span>
        </div>
      </div>

      <div className="space-y-3 flex-grow">
        <InfoRow icon={ICONS.email} label={teacher.email} />
        <InfoRow icon={ICONS.phone} label={teacher.phone} />

        {teacher.education && (
          <InfoRow icon={ICONS.education} label={teacher.education} />
        )}
      </div>

      <div className="mt- pt-4 border-t border-gray-200 text-xs text-gray-500">
        <div className="flex flex-col">
        <span>
          Works since: {new Date(teacher.startWorkDate).toLocaleDateString()}
        </span>

        {experience !== undefined && (
          <span className="mt-1">
            Experience: {+experience} {experience === 1 ? 'year' : 'years'}
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
          {   canDelete &&   (<button
            onClick={onDelete}
            className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
          >
            Delete
          </button>)}

           {/* go to teacher's students */}
          <Link
            to={`/headTeacher/teachers/${teacher.id}/students`}
            className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition-colors"
          >
            Students
          </Link>

           {/* go to teacher's subjects */}
          <Link
            to={`/headTeacher/teachers/${teacher.id}/subjects`}
            className="px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 transition-colors"
          >
            Subjects
          </Link>
        </div>
      </div>
    </div>
  );
};
