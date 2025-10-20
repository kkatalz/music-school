import { loginUser } from "./auth.service";
import type { LoginCredentials } from "./auth.types";
import { useState, useEffect, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { Role } from "../teachers/teacher.types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";


export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

    const navigate = useNavigate();
  const { login } = useAuth();


    const { mutate, isPending, isError, error, data, isSuccess } = useMutation({
    mutationFn: (credentials: LoginCredentials) => loginUser(credentials),
  });

  useEffect(() => {
    if (isSuccess && data) {
      // save user data in global context
      login(data);
      
      // go to proper page based on user's role
      if (data.role === Role.Student) {
        navigate('/student');
      } else  if (data.role === Role.Teacher) {
        console.log('teacher!!!')
      } else if (data.role === Role.HeadTeacher) {
        console.log('head Teacher!!!')
      }
    }
  }, [isSuccess, data, login, navigate]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    mutate({ email, password });
  };


  return (
    <>
    <div className="fixed top-0 left-0 w-screen h-screen -z-10">
      <img src="/background-main.jpg"
      alt="Background"
      className="w-full h-full object-cover">
      </img>
    </div>


   <div  className="flex justify-center items-center min-h-screen">
      <form
        className="p-8 border border-gray-200 rounded-lg shadow-lg max-w-md w-full bg-white" 
       onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center mb-6">Log in to Music School Service</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {isError && (
            <p className="text-red-500 text-center text-sm mb-4">
                {error?.message || "Invalid email or password."}
            </p>
        )}
        
        {isSuccess && (
            <p className="text-green-600 text-center text-sm mb-4">
                You logged in! Hello, {data.firstName}.
            </p>
        )}

        <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            disabled={isPending}
        >
          {isPending ? "Logging in..." : "Log in"}
        </button>
      </form>
    </div>
    </>
  );
};
