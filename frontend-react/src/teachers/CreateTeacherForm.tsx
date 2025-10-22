import { useState } from "react";
import { useCreateTeacher } from "./useTeachers";
import type { FormEvent } from "react";
import type { CreateTeacher } from "./teacher.types";
import { Link } from "react-router";


export const CreateTeacherForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    education : '',
    email: '',
    password: '',
    isHeadTeacher: false,
  });


  const { mutate, isPending, isError, error } = useCreateTeacher();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newTeacher: CreateTeacher = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      education: formData.education,
      email: formData.email,
      password: formData.password,
      isHeadTeacher: formData.isHeadTeacher,
    }

    mutate(newTeacher);
    
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Add new teacher</h1>
        <Link 
            to="/headTeacher/teachers" // back to the teachers list
            className="text-blue-600 hover:underline"
        >
            ← Back to the teachers list
        </Link>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Name</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Surname</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-1 font-semibold">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-1 font-semibold">Password (temporary)</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Phone number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Education</label>
            <input type="text" name="education" value={formData.education} onChange={handleChange} required className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div>
        <label className="block text-gray-700 mb-1 font-semibold">Position</label>
        <select
            name="isHeadTeacher"
            value={String(formData.isHeadTeacher)} 
            onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            isHeadTeacher: e.target.value === 'true' 
            }))}
            required
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <option value="false">Teacher</option>
            <option value="true">Head Teacher</option>
        </select>
        </div>
        
        {isError && (
          <p className="mt-4 text-red-500 text-sm">
            Помилка: {error?.response?.data?.message || 'Could not add new teacher.'}
          </p>
        )}
        
        <div className="mt-8 flex justify-end">
          <button 
            type="submit" 
            disabled={isPending} 
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {isPending ? 'Adding...' : 'Add Teacher'}
          </button>
        </div>
      </form>
    </div>
  );
};
