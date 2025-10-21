import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { useCreateStudent } from './useStudents';
import type { Student } from './student.types';


export const CreateStudentForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    parentPhone: '',
    address: '',
    startStudyDate: new Date().toISOString().split('T')[0],
  });


  const navigate = useNavigate();
  const queryClient = useQueryClient();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: process adding new student
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Створити нового студента</h1>
        <Link 
            to="/admin/students" // Шлях назад до списку
            className="text-blue-600 hover:underline"
        >
            ← Повернутися до списку
        </Link>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Поля форми */}
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Ім'я</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Прізвище</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-1 font-semibold">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-1 font-semibold">Пароль (тимчасовий)</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Телефон</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Телефон батьків</label>
            <input type="tel" name="parentPhone" value={formData.parentPhone} onChange={handleChange} required className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-1 font-semibold">Адреса</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Дата початку навчання</label>
            <input type="date" name="startStudyDate" value={formData.startStudyDate} onChange={handleChange} required className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        
        {/* {isError && (
          <p className="mt-4 text-red-500 text-sm">
            Помилка: {error?.response?.data?.message || 'Не вдалося створити студента.'}
          </p>
        )}
         */}
        <div className="mt-8 flex justify-end">
          <button 
            type="submit" 
            // disabled={isPending} 
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {/* {isPending ? 'Створення...' : 'Створити студента'} */}
          </button>
        </div>
      </form>
    </div>
  );
};
