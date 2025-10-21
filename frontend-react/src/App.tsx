import { Routes, Route } from "react-router";
import { Teachers } from "./teachers/Teachers";
import { Login } from "./auth/Login";
import { StudentDashboardLayout } from "./students/StudentDashboardLayout";
import { StudentProfile } from "./students/StudentProfile";
import { ProtectedRoute } from "./auth/ProtectedRoute";

const App = () => {
  return (
        <Routes>
          <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/student" element={<StudentDashboardLayout />}>
          {/* inner routes for StudentDashboardLayout */}
          { <Route path="profile" element={<StudentProfile />} />
          /*Route path="grades" element={<StudentGrades />} /> */}
        </Route>
      </Route>

          <Route path="/teachers" element={<Teachers />} />
        </Routes>
  );
};

export default App;