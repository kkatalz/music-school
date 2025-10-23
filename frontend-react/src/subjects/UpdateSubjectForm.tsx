import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useSubjectsInfo, useUpdateSubject } from './hooks/useSubjects';
import type { UpdateSubject } from './types/subjects.types';

export const UpdateSubjectForm = () => {
  const { data: subjects, isLoading } = useSubjectsInfo();
  const updateSubjectMutation = useUpdateSubject();

  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(
    null
  );
  const [formData, setFormData] = useState<UpdateSubject>({
    name: '',
    studyYear: undefined,
    semester: undefined,
  });

  useEffect(() => {
    if (selectedSubjectId && subjects) {
      const subject = subjects.find((s) => s.id === selectedSubjectId);
      if (subject) {
        setFormData({
          name: subject.name,
          studyYear: subject.studyYear,
          semester: subject.semester,
        });
      }
    }
  }, [selectedSubjectId, subjects]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSubjectId) {
      alert('Please select a subject to update');
      return;
    }

    const updateData: UpdateSubject = {};
    if (formData.name) updateData.name = formData.name;
    if (formData.studyYear !== undefined)
      updateData.studyYear = formData.studyYear;
    if (formData.semester !== undefined)
      updateData.semester = formData.semester;

    updateSubjectMutation.mutate({
      subjectId: selectedSubjectId,
      newSubjectData: updateData,
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-8">
        <div className="text-center mt-10 text-gray-600">
          <p className="text-xl">Loading subjects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Update Subject
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Select Subject
            </label>
            <select
              id="subject"
              value={selectedSubjectId ?? ''}
              onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">-- Select a subject --</option>
              {subjects?.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name} (Year {subject.studyYear}, Semester{' '}
                  {subject.semester})
                </option>
              ))}
            </select>
          </div>

          {selectedSubjectId && (
            <>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Subject Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter subject name"
                />
              </div>

              <div>
                <label
                  htmlFor="studyYear"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Study Year
                </label>
                <input
                  type="number"
                  id="studyYear"
                  value={formData.studyYear ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      studyYear: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter study year"
                  min="1"
                  max="6"
                />
              </div>

              <div>
                <label
                  htmlFor="semester"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Semester
                </label>
                <input
                  type="number"
                  id="semester"
                  value={formData.semester ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      semester: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter semester"
                  min="1"
                  max="2"
                />
              </div>
            </>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={!selectedSubjectId || updateSubjectMutation.isPending}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {updateSubjectMutation.isPending
                ? 'Updating...'
                : 'Update Subject'}
            </button>
            <button
              type="button"
              onClick={() => <Link to="/headTeacher/subjects"></Link>}
              className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
