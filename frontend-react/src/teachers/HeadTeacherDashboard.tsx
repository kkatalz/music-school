import { DashboardShell, type NavItem } from '../components/DashboardShell';

const navItems: NavItem[] = [
  { to: '/headTeacher/profile', label: 'My profile' },
  { to: '/headTeacher/students', label: 'Students' },
  { to: '/headTeacher/myStudents', label: 'My Students' },
  { to: '/headTeacher/teachers', label: 'Teachers' },
  { to: '/headTeacher/subjects', label: 'Subjects' },
  { to: '/headTeacher/mySubjects', label: 'My Subjects' },
  { to: '/headTeacher/grades', label: 'Manage Grades' },
];

export const HeadTeacherDashboard = () => (
  <DashboardShell roleLabel="Head Teacher" navItems={navItems} />
);
