import { useSubjects } from "./useSubjects";
import { Link } from "react-router";

export const SubjectsPage = () => {
    //const { data: subjects, isLoading, isError, error } = useSubjects();
    

    return (
        <div className="p-4 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Subject list</h1>
        <Link
          to="/headTeacher/subjects/new"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-sm"
        >
          Add Subject
        </Link>

         <Link
          to="/headTeacher/subjects/addTeacherToSubject"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-sm"
        >
          Add Teacher to Subject
        </Link>

                 <Link
          to="/headTeacher/subjects/addStudentToSubject"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-sm"
        >
          Add Student to Subject
        </Link>

      </div>

      {/* {!subjects || subjects.length === 0 ? (
        <div className="text-center mt-10 text-gray-600 bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl">No teachers at the moment.</h3>
            <p>As soon as they will be added, you will see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((teacher) => (
            <TeacherCard 
            key={teacher.id} 
            teacher={teacher}
            onEdit={() => handleEdit(teacher.id)}
            onDelete={() => handleDelete(teacher.id)} />
          ))}
        </div>
      )} */}
    </div>
    )
}