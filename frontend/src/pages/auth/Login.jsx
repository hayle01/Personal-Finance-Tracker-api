import { Navigate } from 'react-router';
import { LoginForm } from '../../components/auth/LoginForm'
import useAuthStore from '../../lib/Store/authStore';

export const Login = () => {
   const { user, isAuthenticated } = useAuthStore();

  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
        <>
      <div className="min-h-screen bg-gradient-to-br from-secondary to-secondary/20 flex flex-col items-center justify-center ">
          <div className="z-10 w-full max-w-md px-4">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-foreground">Hi, welcome back</h1>
              <p>We're glad to see again</p>
            </div>
            {/* Login form */}
          <LoginForm />
          </div>
      </div>
    </>
  )
}
