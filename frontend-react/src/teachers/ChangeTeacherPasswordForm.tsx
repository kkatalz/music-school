import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { useUpdateTeacherPassword } from './useTeachers';



export const ChangeTeacherPasswordForm = () => {
  const [newPassword, setNewPassword] = useState('');
    const [newPasswordFinal, setNewPasswordFinal] = useState('');

    const { mutate, isPending } = useUpdateTeacherPassword();
  


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== newPasswordFinal) {
        alert('Passwords do not match.');
        return;
    }
    mutate(newPassword);
    setNewPassword('');
    setNewPasswordFinal('');
    
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 p-8 bg-white rounded-lg shadow-lg max-w-2xl">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">Change password</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1 font-semibold">New password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="new-password"
          />
        </div>

         <div>
          <label className="block text-gray-700 mb-1 font-semibold">Confirm new password</label>
          <input
            type="password"
            value={newPasswordFinal}
            onChange={(e) => setNewPasswordFinal(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="new-password"
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isPending} 
        className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
      >
        {isPending ? 'Updating...' : 'Change password'}
      </button>
    </form>
  )
}