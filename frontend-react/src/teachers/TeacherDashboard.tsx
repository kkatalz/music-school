import { DashboardShell, type NavItem } from '../components/DashboardShell';

const navItems: NavItem[] = [
  { to: '/teacher/profile', label: 'My profile' },
  { to: '/teacher/myStudents', label: 'My students' },
  { to: '/teacher/grades', label: 'Manage Grades' },
  { to: '/teacher/mySubjects', label: 'My subjects' },
];

export const TeacherDashboard = () => (
  <DashboardShell roleLabel='Teacher' navItems={navItems} />
);
