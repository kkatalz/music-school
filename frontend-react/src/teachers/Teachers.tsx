import { useTeachers, useDeleteTeacher } from "./useTeachers";
import { Link } from 'react-router-dom';
import { TeacherCard } from "./TeacherCard";
import { useNavigate } from "react-router-dom";


export const Teachers = () => {
  const navigate = useNavigate();

    const { data: teachers, isLoading, isError, error } = useTeachers();
    const { mutate: deleteTeacher} = useDeleteTeacher();


  const handleDelete = (teacherId: number) => {
    if (window.confirm("Are you sure about deleting this teacher?")) {
      deleteTeacher(teacherId);
    }
  };

    const handleEdit = (teacherId: number) => {
    navigate(`/headTeacher/teachers/edit/${teacherId}`); // TODO: add this path to App.tsx
  };



  if (isError) {
    return <h1>{error.message}</h1>;
  }
  if (isLoading) return <h1>loading ...</h1>;

  return (
    
    <div className="p-4 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Teacher list</h1>
        <Link
          to="/headTeacher/teachers/new"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-sm"
        >
          Add Teacher
        </Link>
      </div>

      {!teachers || teachers.length === 0 ? (
        <div className="text-center mt-10 text-gray-600 bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl">No teachers at the moment.</h3>
            <p>As soon as they will be added, you will see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teachers.map((teacher) => (
            <TeacherCard 
            key={teacher.id} 
            teacher={teacher}
            onEdit={() => handleEdit(teacher.id)}
            onDelete={() => handleDelete(teacher.id)} />
          ))}
        </div>
      )}
    </div>
  );

};
