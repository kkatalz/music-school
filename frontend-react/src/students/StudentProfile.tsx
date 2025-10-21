import { useGetStudentInfo } from "./useStudents";
import { useAuth } from "../auth/AuthContext";
import { NavLink, Outlet, useNavigate } from 'react-router-dom';



export const StudentProfile = () => {
    const { user } = useAuth();
    const studentId = user ? Number(user.id) : null; 

    const { data: student, isLoading, isError, error } = useGetStudentInfo(studentId);

  if (isLoading) {
    return <div>Loading info...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if(!student) {
        return <div className="text-center mt-10">Не вдалося завантажити інформацію про студента.</div>; 
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My info</h2>

      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl">
        <div className="border-b pb-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{student.firstName} {student.lastName}</h1>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            <span className="font-semibold text-gray-700">Email:</span>
            <span className="ml-2 text-gray-900">{student.email}</span>
          </div>

          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            <span className="font-semibold text-gray-700">Phone number:</span>
            <span className="ml-2 text-gray-900">{student.phone}</span>
          </div>

          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            <span className="font-semibold text-gray-700">Parent phone number:</span>
            <span className="ml-2 text-gray-900">{student.parentPhone}</span>
          </div>
          
          <div className="flex items-center">
             <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <span className="font-semibold text-gray-700">Address:</span>
            <span className="ml-2 text-gray-900">{student.address}</span>
          </div>
          
          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <span className="font-semibold text-gray-700">Start study date:</span>
            <span className="ml-2 text-gray-900">
                {new Date(student.startStudyDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}