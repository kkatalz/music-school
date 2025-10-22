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
import { CreateStudentForm } from "./students/CreateStudentForm";
import { CreateTeacherForm } from "./teachers/CreateTeacherForm";
import { UpdateTeacherForm } from "./teachers/UpdateTeacherForm";

const App = () => {
  return (
        <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
          <Route path="/teacher" element={<TeacherDashboard />} />
      </Route>

      <Route element={<ProtectedRoute />}>
          <Route path="/headTeacher" element={<HeadTeacherDashboard />} >
          <Route path="teachers" element={<Teachers />} />
          <Route path="teachers/new" element={<CreateTeacherForm/>} />
          <Route path="teachers/edit/:teacherId" element={<UpdateTeacherForm/>} />
          
          <Route path="students" element={< AllStudents/>} />
          <Route path="students/new" element={< CreateStudentForm/>} />

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