import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom"; 
import { useGetStudentInfo, useUpdateStudent } from "./useStudents.ts";
import type { UpdateStudent } from "./student.types.ts";

export const UpdateStudentForm = () => {
    const { studentId: studentId } = useParams<{ studentId: string }>();
    const numStudentId = Number(studentId);

    const { data: initialStudentData, isLoading, isError: isFetchError, error: fetchError } = useGetStudentInfo(numStudentId);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        parentPhone: '',
        address: '',
        startStudyDate: '',
        email: '',
    });

    useEffect(() => {
        if (initialStudentData) {
            const dateObject = new Date(initialStudentData.startStudyDate);
            const formattedStartDate = dateObject.toISOString().split('T')[0];
            setFormData({
                firstName: initialStudentData.firstName || '',
                lastName: initialStudentData.lastName || '',
                phone: initialStudentData.phone || '',
                parentPhone: initialStudentData.parentPhone || '',
                address: initialStudentData.address || '',
                startStudyDate: formattedStartDate || '',
                email: initialStudentData.email || '',
            });
        }
    }, [initialStudentData]); 

    const { mutate, isPending, isError: isUpdateError, error: updateError } = useUpdateStudent();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const newStudentData: UpdateStudent = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            parentPhone: formData.parentPhone,
            address: formData.address,
            startStudyDate: new Date(formData.startStudyDate),
            email: formData.email,
        }
        mutate({ studentId: numStudentId, newStudentData: newStudentData});
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
                <h1 className="text-3xl font-bold text-gray-800">Edit student data</h1>
                <Link 
                    to="/headTeacher/students" 
                    className="text-blue-600 hover:underline"
                >
                    ← Back to the students list
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
                        <label className="block text-gray-700 mb-1 font-semibold">Parent phone number</label>
                        <input type="tel" name="parentPhone" value={formData.parentPhone} onChange={handleChange} required className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                              <div className="md:col-span-2">
                        <label className="block text-gray-700 mb-1 font-semibold">Address</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                     <div>
            <label className="block text-gray-700 mb-1 font-semibold">Start study date</label>
            <input type="date" name="startStudyDate" value={formData.startStudyDate} onChange={handleChange} required className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
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

