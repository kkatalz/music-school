import { Routes, Route } from "react-router";
import { Teachers } from "./teachers/Teachers";
import { Login } from "./auth/Login";
import { StudentDashboardLayout } from "./students/StudentDashboardLayout";
import { StudentProfile } from "./students/StudentProfile";
import { StudentGrades } from "./students/StudentGrades";
import { ProtectedRoute } from "./auth/ProtectedRoute";

const App = () => {
  return (
        <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/teachers" element={<Teachers />} />

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