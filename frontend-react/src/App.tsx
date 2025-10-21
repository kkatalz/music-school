import { Routes, Route } from "react-router";
import { Teachers } from "./teachers/Teachers";
import { Login } from "./auth/Login";
import { StudentDashboardLayout } from "./students/StudentDashboardLayout";
import { StudentProfile } from "./students/StudentProfile";
import { StudentGrades } from "./students/StudentGrades";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { TeacherDashboard } from "./teachers/TeacherDashboard";
import { HeadTeacherDashboard } from "./teachers/HeadTeacherDashboard";
import { AllStudents } from "./students/AllStudents";

const App = () => {
  return (
        <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
          <Route path="/teacher" element={<TeacherDashboard />} />
      </Route>

      <Route element={<ProtectedRoute />}>
          <Route path="/headTeacher" element={<HeadTeacherDashboard />} >
          <Route path="students" element={< AllStudents/>} />

      </Route>
      </Route>
      
      <Route element={<ProtectedRoute />}>
        <Route path="/student" element={<StudentDashboardLayout />}>
          <Route path="profile" element={<StudentProfile />} />
          <Route path="grades" element={<StudentGrades />} />
        </Route>
      </Route>

    </Routes>
  );
};

export default App;