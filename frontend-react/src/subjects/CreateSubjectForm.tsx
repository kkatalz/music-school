import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useCreateSubject } from './useSubjects';
import type { CreateSubject } from './subjects.types';


export const CreateSubjectForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    studyYear: '',
    semester: '',
  });


  const { mutate, isPending, isError, error } = useCreateSubject();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newSubject: CreateSubject = {
      name: formData.name,
      studyYear: Number(formData.studyYear),
      semester: Number(formData.semester),
    }

    mutate(newSubject);
    
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Add new subject</h1>
        <Link 
            to="/headTeacher/subjects" 
            className="text-blue-600 hover:underline"
        >
            ← Back to the subject list
        </Link>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Study Year</label>
            <select 
                name="studyYear" 
                value={formData.studyYear} 
                onChange={handleChange} 
                required 
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
                <option value="" disabled>
                Choose study year
                </option>
                    {[1, 2, 3, 4, 5, 6, 7].map(year => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                    ))}
                </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-1 font-semibold">Semester</label>
                <select 
                name="semester" 
                value={formData.semester} 
                onChange={handleChange} 
                required 
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
                <option value="" disabled>
                Choose semester
                </option>
                    {[1, 2].map(year => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                    ))}
                </select>          </div>
        </div>
        
        {isError && (
          <p className="mt-4 text-red-500 text-sm">
            Error: {error?.response?.data?.message || 'Could not add new subject.'}
          </p>
        )}
        
        <div className="mt-8 flex justify-end">
          <button 
            type="submit" 
            disabled={isPending} 
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {isPending ? 'Adding...' : 'Add Subject'}
          </button>
        </div>
      </form>
    </div>
  );
};
