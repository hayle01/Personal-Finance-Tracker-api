import React from 'react'
import { RegisterForm } from '../../components/auth/RegisterForm'
import useAuthStore from '../../lib/Store/authStore';
import { Navigate } from 'react-router';

export const Register = () => {
   const { user, isAuthenticated } = useAuthStore();

  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <>
         <div className="min-h-screen bg-gradient-to-br from-secondary to-secondary/20 flex flex-col items-center justify-center pt-4">
             <div className="z-10 w-full max-w-md px-4">
               <div className="mb-8 text-center">
                 <h1 className="text-3xl font-bold text-foreground">Join us today</h1>
                 <p>Craete an account in just a few steps</p>
               </div>
               {/* Registeration form */}
               <RegisterForm />
             </div>
         </div>
       </>
  )
}
