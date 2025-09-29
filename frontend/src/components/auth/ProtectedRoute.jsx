import React, { useEffect } from "react";
import useAuthStore from "../../lib/Store/authStore";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api/ApiClient";
import { Navigate, useLocation } from "react-router";
import { Loader } from "lucide-react";

export const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { user, setAuth, clearAuth, token } = useAuthStore();

  const { data, error, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await api.get("/auth/me");
      console.log( " response data from auth/me", response);
      return response.data;
    },
    retry: 1,
  });

  // error case
  useEffect(() => {
    if (isError) {
      clearAuth();
    }
  }, [isError, error, clearAuth]);

  // success case
  useEffect(() => {
    if (isSuccess && data?.user) {
      setAuth(data.user, token);
    }
  }, [isSuccess, data, setAuth, token]);

  if (isLoading || (isSuccess && !user)) {
    return (
      <div className="flex h-screen justify-center items-center">
        <Loader size={30} className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};
