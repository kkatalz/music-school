import { DashboardShell, type NavItem } from '../components/DashboardShell';

const navItems: NavItem[] = [
  { to: '/student/profile', label: 'My profile' },
  { to: '/student/subjects', label: 'My subjects' },
  { to: '/student/teachers', label: 'My teachers' },
  { to: '/student/grades', label: 'My grades' },
];

export const StudentDashboardLayout = () => (
  <DashboardShell roleLabel='Student' navItems={navItems} />
);
