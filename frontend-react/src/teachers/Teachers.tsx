import { useTeachers, useDeleteTeacher } from "./useTeachers";
import { Link } from 'react-router-dom';
import { TeacherCard } from "./TeacherCard";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Teacher } from "./teacher.types";


export const Teachers = () => {
  const { data: teachers, isLoading, isError } = useTeachers();
  const navigate = useNavigate();
  const { mutate: deleteTeacher } = useDeleteTeacher();

  const [searchId, setSearchId] = useState('');
  const [filteredTeacher, setFilteredTeacher] = useState<Teacher | null | undefined>(undefined);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleEdit = (id: number) => {
    navigate(`/headTeacher/teachers/edit/${id}`);
  };

  const handleDelete = (teacherId: number) => {
    if (window.confirm("Are you sure about deleting this teacher?")) {
      deleteTeacher(teacherId);
    }
  };

  const handleSearchById = () => {
    if (!searchId || isNaN(Number(searchId))) return;
    
    const numericId = Number(searchId);
    const foundTeacher = teachers?.find(teacher => teacher.id === numericId);
    
    setFilteredTeacher(foundTeacher);
    setIsSearchActive(true);
  };

  const handleClearSearch = () => {
    setSearchId('');
    setFilteredTeacher(undefined);
    setIsSearchActive(false);
  };
  
  const teachersToDisplay = isSearchActive
    ? (filteredTeacher ? [filteredTeacher] : [])
    : teachers;

  if (isLoading) {
    return <div>Loading teachers...</div>;
  }
  if (isError) {
    return <div>Error loading teachers.</div>;
  }

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

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Search by Teacher ID
        </h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <input
              type="number"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter teacher ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSearchById}
              disabled={!searchId || isNaN(Number(searchId))}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Search
            </button>
            {isSearchActive && (
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>

        {isSearchActive && (
          <div className={`mt-4 p-3 rounded-md border ${
            filteredTeacher 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <p className={`font-medium ${
              filteredTeacher ? 'text-green-800' : 'text-red-800'
            }`}>
              {filteredTeacher 
                ? `Found teacher with ID: ${searchId}` 
                : `Teacher with ID ${searchId} was not found`}
            </p>
          </div>
        )}
      </div>

      {!teachersToDisplay || teachersToDisplay.length === 0 ? (
        <div className="text-center mt-10 text-gray-600 bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl">
              {isSearchActive ? 'No teacher found for this ID.' : 'No teachers at the moment.'}
            </h3>
            <p>
              {isSearchActive ? 'Try a different ID or clear the search.' : 'As soon as they will be added, you will see it here.'}
            </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teachersToDisplay.map((teacher) => (
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
