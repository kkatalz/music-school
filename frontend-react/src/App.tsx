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
import { TeacherProfile } from "./teachers/TeacherProfile";
import { UpdateStudentForm } from "./students/UpdateStudentForm";
import { SubjectsPage } from "./subjects/SubjectsPage";
import { CreateSubjectForm } from "./subjects/CreateSubjectForm";
import { AddTeacherToSubject } from "./subjects/AddTeacherToSubjectForm";
import { AddStudentToSubject } from "./subjects/AddStudentToSubjectForm";
import { MyStudentsPage } from "./students/MyStudentsPage";

const App = () => {
  return (
        <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
          <Route path="/teacher" element={<TeacherDashboard />} >
          <Route path="myStudents" element={<MyStudentsPage />} />
          </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
          <Route path="/headTeacher" element={<HeadTeacherDashboard />} >
          <Route path="myStudents" element={<MyStudentsPage />} />
          <Route path="subjects" element={<SubjectsPage />} />
          <Route path="subjects/new" element={< CreateSubjectForm/>} />
           <Route path="subjects/addTeacherToSubject" element={< AddTeacherToSubject/>} />
          <Route path="subjects/addStudentToSubject" element={< AddStudentToSubject/>} />
          <Route path="profile" element={<TeacherProfile />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="teachers/new" element={<CreateTeacherForm/>} />
          <Route path="teachers/edit/:teacherId" element={<UpdateTeacherForm/>} />
          
          <Route path="students" element={< AllStudents/>} />
          <Route path="students/new" element={< CreateStudentForm/>} />
          <Route path="students/edit/:studentId" element={<UpdateStudentForm/>} />

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