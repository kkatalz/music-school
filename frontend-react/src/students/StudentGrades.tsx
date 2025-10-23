import { useGetStudentAllGrades } from "../grades/useGrades";
import { useAuth } from "../auth/AuthContext";


export const StudentGrades = () => {
    const { user } = useAuth();
    const studentId = user ? Number(user.id) : null;

    const { data: grades, isLoading, isError, error } = useGetStudentAllGrades(studentId);

    if (isLoading) {
            return <div className="text-center mt-10">Loading your grades...</div>;
        }

    if (isError) {
        return <div className="text-center mt-10 text-red-600">Error: {error.message}</div>;
    }

    if (!grades || grades.length === 0) {
        return (
            <div className="text-center mt-10 text-gray-600">
                <h3 className="text-xl">You don't have any grade yet.</h3>
                <p>As soon as teacher set you a grade, it will appear here.</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">My grades</h2>
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                {grades.map((grade) => (
                    <div key={grade.id} className="flex justify-between items-center border-b pb-2">
                        <span className="text-lg">{grade.subject?.name}</span>
                        <span className="text-xl font-bold text-blue-600">{grade.value}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}