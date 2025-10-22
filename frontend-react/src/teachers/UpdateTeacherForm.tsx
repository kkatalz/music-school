import { useEffect, useState } from "react";
import { useUpdateTeacher, useGetTeacherById } from "./useTeachers.ts";
import type { FormEvent } from "react";
import type { UpdateTeacher } from "./teacher.types.ts";
import { Link, useParams } from "react-router-dom"; 

export const UpdateTeacherForm = () => {
    const { teacherId } = useParams<{ teacherId: string }>();
    const nteacherId = Number(teacherId);

    const { data: initialTeacherData, isLoading, isError: isFetchError, error: fetchError } = useGetTeacherById(nteacherId);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        education: '',
        isHeadTeacher: false,
    });

    useEffect(() => {
        if (initialTeacherData) {
            setFormData({
                firstName: initialTeacherData.firstName || '',
                lastName: initialTeacherData.lastName || '',
                email: initialTeacherData.email || '',
                phone: initialTeacherData.phone || '',
                education: initialTeacherData.education || '',
                isHeadTeacher: initialTeacherData.isHeadTeacher || false,
            });
        }
    }, [initialTeacherData]); 

    const { mutate, isPending, isError: isUpdateError, error: updateError } = useUpdateTeacher();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'select-one' && name === 'isHeadTeacher') {
            setFormData(prev => ({ ...prev, isHeadTeacher: value === 'true' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const newTeacherData: UpdateTeacher = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            education: formData.education,
            email: formData.email,
            isHeadTeacher: formData.isHeadTeacher,
        }
        mutate({ teacherId: nteacherId, newTeacherData: newTeacherData});
    };

    if (isLoading) {
        return <div className="p-8 text-center">Loading data...</div>;
    }

    if (isFetchError) {
        return <div className="p-8 text-center text-red-600">Error while loading: {fetchError?.message || 'Could not load data'}</div>;
    }

    return (
        <div className="p-4 sm:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Edit teacher data</h1>
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
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full mt-1 px-4 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1 font-semibold">Surname</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full mt-1 px-4 py-2 border rounded-md" />
                    </div>
                     <div className="md:col-span-2">
                        <label className="block text-gray-700 mb-1 font-semibold">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full mt-1 px-4 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1 font-semibold">Phone number</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full mt-1 px-4 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1 font-semibold">Education</label>
                        <input type="text" name="education" value={formData.education} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-md" />
                     </div>
                    <div>
                        <label className="block text-gray-700 mb-1 font-semibold">Position</label>
                        <select
                            name="isHeadTeacher"
                            value={String(formData.isHeadTeacher)} 
                            onChange={handleChange}
                            required
                            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="false">Teacher</option>
                            <option value="true">Head Teacher</option>
                        </select>
                    </div>
                </div>
                
                {isUpdateError && (
                <p className="mt-4 text-red-500 text-sm">
                    Updating error: {updateError?.response?.data?.message || 'Could not save changes.'}
                </p>
                )}
                
                <div className="mt-8 flex justify-end">
                <button 
                    type="submit" 
                    disabled={isPending} 
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                    {isPending ? 'Saving...' : 'Save changes'}
                </button>
                </div>
            </form>
        </div>
    );
};

