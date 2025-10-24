import { useGetTeacherStudents } from "./useTeachers";
import { useParams } from "react-router";
import { useState } from "react";
import { StudentCard } from "../students/StudentCatd";
import { useNavigate } from "react-router";
import { useDeleteStudent } from "../students/useStudents";
import { useGetTeacherById } from "./useTeachers";



export const TeacherStudents = () => {
    const navigate = useNavigate();
      const { mutate: deleteStudent } = useDeleteStudent();
    

  const { teacherId } = useParams<{ teacherId: string }>();
  const numTeacherId = Number(teacherId);

  // get info about teacher
  const { data: teacher } = useGetTeacherById(numTeacherId);

  const [year, setYear] = useState<string>('');
  const [semester, setSemester] = useState<string>('');

  const numYear = year ? parseInt(year, 10) : undefined;
  const numSemester = semester ? parseInt(semester, 10) : undefined;

  const { 
    data: students, 
    isLoading, 
    isError 
  } = useGetTeacherStudents(numTeacherId, numYear, numSemester);


    const handleEdit = (studentId: number) => {
    navigate(`/headTeacher/students/edit/${studentId}`);
  };

    const handleDelete = (studentId: number) => {
    if (window.confirm('Are you sure about deleting this student?')) {
      deleteStudent(studentId);
    }
  };



  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Students of Teacher {teacher?.firstName} {teacher?.lastName}
      </h1>

      {/* filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex gap-4">
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">
            Year
          </label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="e.g., 3"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
            Semester
          </label>
          <input
            type="number"
            id="semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            placeholder="e.g., 1"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Student data --- */}
      {isLoading && (
        <div className="text-center text-gray-600">Loading students...</div>
      )}

      {isError && (
        <div className="text-center text-red-600">Error loading students.</div>
      )}

      {!isLoading && !isError && students && (
        <>
          {students.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map(student => (
                <StudentCard 
                key={student.id} 
                student={student}
                onEdit={() => handleEdit(student.id)}
                onDelete={() => handleDelete(student.id)}
                 />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No students found for these criteria.
            </div>
          )}
        </>
      )}
    </div>
  );
};
