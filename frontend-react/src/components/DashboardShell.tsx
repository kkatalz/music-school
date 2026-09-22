import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export interface NavItem {
  to: string;
  label: string;
}

interface DashboardShellProps {
  roleLabel: string;
  navItems: NavItem[];
}

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  `flex items-center px-4 py-3 rounded-md hover:bg-gray-700 transition-colors ${
    isActive ? 'bg-gray-900' : ''
  }`;

export const DashboardShell = ({
  roleLabel,
  navItems,
}: DashboardShellProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // a tap on a nav link should leave the drawer closed on the next screen
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ');

  return (
    <div className='flex h-dvh flex-col bg-gray-100 lg:flex-row'>
      <header className='flex items-center gap-3 bg-gray-800 px-4 py-3 text-white lg:hidden'>
        <button
          type='button'
          onClick={() => setIsSidebarOpen(true)}
          aria-label='Open menu'
          aria-expanded={isSidebarOpen}
          className='-ml-2 rounded-md p-2 hover:bg-gray-700 transition-colors'
        >
          <svg
            className='h-6 w-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            aria-hidden='true'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M4 6h16M4 12h16M4 18h16'
            />
          </svg>
        </button>
        <div className='min-w-0'>
          <span className='block text-xs text-gray-400'>{roleLabel}</span>
          <span className='block truncate font-semibold'>{fullName}</span>
        </div>
      </header>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className='fixed inset-0 z-40 bg-black/50 lg:hidden'
          aria-hidden='true'
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85%] flex-col bg-gray-800 text-white transition-transform duration-300 ease-in-out lg:static lg:w-64 lg:max-w-none lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='flex items-start justify-between gap-2 border-b border-gray-700 p-4 text-xl font-bold'>
          <div className='min-w-0'>
            <span className='block text-sm font-normal text-gray-400'>
              {roleLabel}
            </span>
            <span className='block break-words'>{fullName}</span>
          </div>
          <button
            type='button'
            onClick={() => setIsSidebarOpen(false)}
            aria-label='Close menu'
            className='-mr-2 -mt-1 rounded-md p-2 hover:bg-gray-700 transition-colors lg:hidden'
          >
            <svg
              className='h-5 w-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              aria-hidden='true'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        <nav className='flex-1 space-y-1 overflow-y-auto p-2'>
          {navItems.map(({ to, label }) => (
            <NavLink key={to} to={to} className={navLinkClasses}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className='border-t border-gray-700 p-4'>
          <button
            onClick={handleLogout}
            className='w-full rounded-md bg-red-600 py-2.5 text-white hover:bg-red-700 transition-colors'
          >
            Log out
          </button>
        </div>
      </aside>

      <main className='flex-1 overflow-y-auto'>
        <Outlet />
      </main>
    </div>
  );
};
