import {
  useGetStudentInfo,
  useGetAllStudents,
  useDeleteStudent,
  useGetStudentsByPeriod,
  useGetTotalStudentsByPeriod,
} from './useStudents';
import { StudentCard } from './StudentCatd';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const AllStudents = () => {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [filterEnabled, setFilterEnabled] = useState(false);

  const [searchId, setSearchId] = useState<string>('');
  const [searchEnabled, setSearchEnabled] = useState(false);

  const {
    data: allStudents,
    isLoading: isLoadingAll,
    isError: isErrorAll,
    error: errorAll,
  } = useGetAllStudents();
  const {
    data: filteredStudents,
    isLoading: isLoadingFiltered,
    isError: isErrorFiltered,
  } = useGetStudentsByPeriod(
    filterEnabled ? startDate : null,
    filterEnabled ? endDate : null
  );
  const {
    data: searchedStudent,
    isLoading: isLoadingSearch,
    isError: isErrorSearch,
  } = useGetStudentInfo(
    searchEnabled && searchId ? Number(searchId) : null
  );
  const { data: totalCount } = useGetTotalStudentsByPeriod(
    filterEnabled ? startDate : null,
    filterEnabled ? endDate : null
  );

  const { mutate: deleteStudent } = useDeleteStudent();

  const students = searchEnabled && searchedStudent 
    ? [searchedStudent] 
    : filterEnabled 
    ? filteredStudents 
    : allStudents;
    
  const isLoading = searchEnabled 
    ? isLoadingSearch 
    : filterEnabled 
    ? isLoadingFiltered 
    : isLoadingAll;
    
  const isError = searchEnabled 
    ? false
    : filterEnabled 
    ? isErrorFiltered 
    : isErrorAll;
  const error = isErrorAll ? errorAll : null;

  const handleDelete = (studentId: number) => {
    if (window.confirm('Are you sure about deleting this student?')) {
      deleteStudent(studentId);
    }
  };

  const handleEdit = (studentId: number) => {
    navigate(`/headTeacher/students/edit/${studentId}`);
  };

  const handleApplyFilter = () => {
    if (startDate && endDate) {
      setFilterEnabled(true);
    }
  };

  const handleClearFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setFilterEnabled(false);
  };

  const handleSearchById = () => {
    if (searchId && !isNaN(Number(searchId))) {
      setFilterEnabled(false);
      setSearchEnabled(true);
    }
  };

  const handleClearSearch = () => {
    setSearchId('');
    setSearchEnabled(false);
  };

  if (isError) {
    return <h1>{error?.message || 'An error occurred'}</h1>;
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

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Search by Student ID
        </h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <input
              type="number"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter student ID"
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
            {searchEnabled && (
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>

        {searchEnabled && (
          <div className={`mt-4 p-3 rounded-md border ${
            searchedStudent 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <p className={`font-medium ${
              searchedStudent ? 'text-green-800' : 'text-red-800'
            }`}>
              {searchedStudent 
                ? `Found student with ID: ${searchId}` 
                : `Student with ID ${searchId} was not found`}
            </p>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Filter by enrollment period
        </h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate || ''}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate || ''}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleApplyFilter}
              disabled={!startDate || !endDate}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Apply Filter
            </button>
            {filterEnabled && (
              <button
                onClick={handleClearFilter}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {filterEnabled && totalCount !== undefined && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-blue-800 font-medium">
              Found {totalCount} student{totalCount !== 1 ? 's' : ''} enrolled
              between {new Date(startDate!).toLocaleDateString()} and{' '}
              {new Date(endDate!).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {!students || students.length === 0 ? (
        <div className="text-center mt-10 text-gray-600 bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-xl">
            {filterEnabled
              ? 'No students found for this period.'
              : 'No students at the moment.'}
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
