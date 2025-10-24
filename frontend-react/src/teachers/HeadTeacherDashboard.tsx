import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export const HeadTeacherDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  //
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          <span className="block text-sm font-normal text-gray-400">
            Head Teacher
          </span>
          {user?.firstName} {user?.lastName}
        </div>
        <nav className="flex-1 p-2 space-y-2">
          <NavLink
            to="/headTeacher/profile"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors ${
                isActive ? 'bg-gray-900' : ''
              }`
            }
          >
            My profile
          </NavLink>

          <NavLink
            to="/headTeacher/students"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors ${
                isActive ? 'bg-gray-900' : ''
              }`
            }
          >
            Students
          </NavLink>

          <NavLink
            to="/headTeacher/myStudents"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors ${
                isActive ? 'bg-gray-900' : ''
              }`
            }
          >
            My Students
          </NavLink>

          <NavLink
            to="/headTeacher/teachers"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors ${
                isActive ? 'bg-gray-900' : ''
              }`
            }
          >
            Teachers
          </NavLink>

          <NavLink
            to="/headTeacher/subjects"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors ${
                isActive ? 'bg-gray-900' : ''
              }`
            }
          >
            Subjects
          </NavLink>
          <NavLink
            to="/headTeacher/grades"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors ${
                isActive ? 'bg-gray-900' : ''
              }`
            }
          >
            Manage Grades
          </NavLink>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
