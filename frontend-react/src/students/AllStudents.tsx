import { useGetAllStudents, useDeleteStudent } from "./useStudents";
import { StudentCard } from "./StudentCatd";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";



export const AllStudents = () => {
  const navigate = useNavigate();
  const { data: students, isLoading, isError, error } = useGetAllStudents();
  const { mutate: deleteStudent } = useDeleteStudent();

    const handleDelete = (studentId: number) => {
    if (window.confirm("Are you sure about deleting this student?")) {
      deleteStudent(studentId);
    }
  };

    const handleEdit = (studentId: number) => {
      // TODO: implement
    navigate(`/headTeacher/students/edit/${studentId}`);
  };


  if (isError) {
    return <h1>{error.message}</h1>;
  }
  if (isLoading) return <h1>loading ...</h1>;

  return (
    
    <div className="p-4 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Student list</h1>
        <Link
          to="/headTeacher/students/new"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-sm"
        >
          Add Student
        </Link>
      </div>

      {!students || students.length === 0 ? (
        <div className="text-center mt-10 text-gray-600 bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl">No students at the moment.</h3>
            <p>As soon as they will be added, you will see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {students.map((student) => (
            <StudentCard 
            key={student.id} 
            student={student}
            onEdit={() => handleEdit(student.id)}
            onDelete={() => handleDelete(student.id)}
             />
          ))}
        </div>
      )}
    </div>
  );
};
