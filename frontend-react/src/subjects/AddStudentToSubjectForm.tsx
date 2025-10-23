import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAddStudentToSubject, useSubjects } from './useSubjects';
import { useGetAllStudents } from '../students/useStudents';


export const AddStudentToSubject = () => {
    const { data: students } = useGetAllStudents();
    const { data: subjects } = useSubjects();
    
  const [formData, setFormData] = useState({
    student: '',
    subject: '',
  });


  const { mutate, isPending, isError, error } = useAddStudentToSubject();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
      const studentId =  Number(formData.student);
      const subjectId =  Number(formData.subject);

    mutate({ studentId, subjectId });
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Add student to the subject</h1>
        <Link 
            to="/headTeacher/subjects" 
            className="text-blue-600 hover:underline"
        >
            ← Back to the subject list
        </Link>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-1 font-semibold">Student</label>
            <select 
                name="student" 
                value={formData.student} 
                onChange={handleChange} 
                required 
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
                <option value="" disabled>
                Choose student
                </option>
                    {students?.map(student => (
                    <option key={student.id} value={student.id}>
                        {student.firstName} {student.lastName}
                    </option>
                    ))}
                </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-1 font-semibold">Subject</label>
                <select 
                name="subject" 
                value={formData.subject} 
                onChange={handleChange} 
                required 
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
                <option value="" disabled>
                Choose subject
                </option>
                    {subjects?.map(subject => (
                    <option key={subject.id} value={subject.id}>
                        {subject.name} | Year: {subject.studyYear} | Semester: {subject.semester}
                    </option>
                    ))}
                </select>          </div>
        </div>
        
        {isError && (
          <p className="mt-4 text-red-500 text-sm">
            Помилка: {error?.response?.data?.message || 'Could not add student to subject.'}
          </p>
        )}
        
        <div className="mt-8 flex justify-end">
          <button 
            type="submit" 
            disabled={isPending} 
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {isPending ? 'Adding...' : 'Add Student'}
          </button>
        </div>
      </form>
    </div>
  );
};
